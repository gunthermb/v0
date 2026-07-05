/*
  Created by GuntherCloudSolutions
  Last updated: 2026-06-28

  Lambda: per-user data store in DynamoDB. Replaces browser localStorage for the
  resume / pipeline so data follows the signed-in user across devices.
  API Gateway (Cognito-authed):
    GET  /data            → all items for the user
    GET  /data?item=NAME  → one item
    POST /data            → upsert { item, value }
  The user is taken from the verified Cognito JWT (never from the client body).
*/
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME;

// The Lambda owns CORS. ALLOWED_ORIGIN is a comma-separated allow-list (env var); the
// response echoes the caller's origin only if it's on the list (else the first entry).
const ALLOWED = (process.env.ALLOWED_ORIGIN || '*').split(',').map((s) => s.trim()).filter(Boolean);
function corsFor(event) {
  const origin = (event?.headers?.origin) || (event?.headers?.Origin) || '';
  const allow = ALLOWED.includes('*') ? '*' : (origin && ALLOWED.includes(origin) ? origin : (ALLOWED[0] || '*'));
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Vary': 'Origin',
    'Content-Type': 'application/json',
  };
}

export const handler = async (event) => {
  const CORS = corsFor(event);
  if (event?.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  const claims = event?.requestContext?.authorizer?.jwt?.claims || {};
  const userId = claims.sub;
  if (!userId) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Not authenticated.' }) };
  }
  const method = event?.requestContext?.http?.method;

  try {
    if (method === 'GET') {
      const one = event?.queryStringParameters?.item;
      if (one) {
        const r = await ddb.send(new GetCommand({ TableName: TABLE, Key: { userId, item: one } }));
        return ok(r.Item || null);
      }
      const r = await ddb.send(new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': userId },
      }));
      return ok(r.Items || []);
    }

    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      if (!body.item) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: '"item" is required.' }) };
      }
      await ddb.send(new PutCommand({
        TableName: TABLE,
        Item: { userId, item: String(body.item), value: body.value ?? null, updatedAt: Date.now() },
      }));
      return ok({ ok: true });
    }

    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed.' }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message || String(err) }) };
  }
};

function ok(data) {
  return { statusCode: 200, headers: CORS, body: JSON.stringify(data) };
}

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { MongoClient, ServerApiVersion } from 'mongodb';

const credential = new DefaultAzureCredential();

const vaultName = 'mongodb-url';
const vaultSecretName = 'mongodb-test-url';
const databaseName = 'sample_restaurants';

export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const mongodbUri = await getMongodbUriFromVault(vaultName, vaultSecretName);
    const collections = await testMongodbConnection(mongodbUri, databaseName);
    return { body: `Mongodb "${databaseName}" collections: ${collections.join(', ')}, timestamp: ${Date.now()}` };
};

async function getMongodbUriFromVault(vaultName: string, secretName: string): Promise<string> {
    const url = `https://${vaultName}.vault.azure.net`;    
    const vaultClient = new SecretClient(url, credential);
    const latestSecret = await vaultClient.getSecret(secretName);
    return latestSecret.value;
}

async function testMongodbConnection(mongodbUri: string, databaseName: string): Promise<string[]> {
    const mongodbClient = new MongoClient(mongodbUri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        await mongodbClient.connect();
        await mongodbClient.db().command({ ping: 1 });
        const collections = await mongodbClient.db(databaseName).collections();
        return collections.map(c => c.collectionName);          
    } catch (e) {
        console.error('Error connecting to Mongodb', e);
    } finally {
        mongodbClient.close();
    }
}

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTrigger1,
});

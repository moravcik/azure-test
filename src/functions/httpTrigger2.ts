import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { MD5 } from 'object-hash';

const exampleObj = {
    "widget": {
        "debug": "on",
        "window": {
            "title": "Sample Konfabulator Widget",
            "name": "main_window",
            "width": 500,
            "height": 500
        },
        "image": { 
            "src": "Images/Sun.png",
            "name": "sun1",
            "hOffset": 250,
            "vOffset": 250,
            "alignment": "center"
        },
        "text": {
            "data": "Click Here",
            "size": 36,
            "style": "bold",
            "name": "text1",
            "hOffset": 250,
            "vOffset": 100,
            "alignment": "center",
            "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
        }
    }
};

const exampleObj2 = {
    "widget": {
        "window": {
            "title": "Sample Konfabulator Widget",
            "name": "main_window",
            "height": 500,
            "width": 500,
        },
        "debug": "on",
        "image": { 
            "name": "sun1",
            "hOffset": 250,
            "vOffset": 250,
            "alignment": "center",
            "src": "Images/Sun.png"
        },
        "text": {
            "data": "Click Here",
            "size": 36,
            "style": "bold",
            "name": "text1",
            "hOffset": 250,
            "vOffset": 100,
            "alignment": "center",
            "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
        }
    }
};


export async function httpTrigger2(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const exampleObjMD5 = MD5(exampleObj);
    const exampleObj2MD5 = MD5(exampleObj2);
    
    exampleObjMD5 === exampleObj2MD5 ? context.log('Objects are equal') : context.log('Objects are not equal');

    return { body: `MD5, ${exampleObjMD5}, ${exampleObj2MD5}` };
};

app.http('httpTrigger2', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTrigger2
});

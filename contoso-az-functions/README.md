# Azure Communication Services <-> QnA Maker Bridge

## How to run?
This is code to create a Azure function which acts as a bridge between a bot user and actual user for **Contoso Med** sample application.
The Azure function code can be found in `acs-chat-event-trigger/index.js`

### Steps
1. Create a new **Azure Function App** instance in your azure account. Make sure to select NodeJS as runtime stack of choice.

2. Add a new function inside your **Azure Function App**.

3. Click on **Develop Locally** inside the Functions pane to download the source code.

4. Copy contents of `acs-chat-event-trigger/` directory in your function folder.

5. Run `npm install` to install all dependencies.

6. Open `index.js` and change the following constants.
```javascript
// format: https://{website_url}/qnamaker/knowledgebases/{GUID}/generateAnswer
const qnaMakerEndpoint = "QnA maker endpoint" 

// format: EndpointKey {GUID}
const qnaMakerEndpointKey = "QnA maker endpoint key for authentication" 

// format: https://{instance_name}.communication.azure.com
const acsEndpoint = "Communication Service Endpoint" 

// example: https://{deployment_url}.azurewebsites.net
const apiEndpoint = "Contoso Med API endpoint"
```

7. Next, deploy the **Azure Function** back to Azure by using [Azure Functions Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for VS Code. Refer to the instructions [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-function-vs-code?pivots=programming-language-javascript#publish-the-project-to-azure) on how to deploy.


Make sure that you have configured EventGrid in for your **Azure Communication Services** instance by follow the steps [here](https://docs.microsoft.com/en-us/azure/communication-services/concepts/event-handling#quickstarts-and-how-tos).
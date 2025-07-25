import { AzureOpenAI } from "openai";

const endpoint = "https://akash-mdhhhihj-australiaeast.cognitiveservices.azure.com/";
const modelName = "gpt-4o-mini";
const deployment = "gpt-4o-mini";


export async function callChatFunction(input) {

  const apiKey = "3W2MYJCf4tWzuWvjbrRODZVgN0F96ltBARfO3SZjVyRIUMok7khgJQQJ99BGACL93NaXJ3w3AAAAACOG8lW2";
  const apiVersion = "2024-04-01-preview";
  const options = { endpoint, apiKey, deployment, apiVersion, dangerouslyAllowBrowser: true}

  const client = new AzureOpenAI(options);



  const response = await client.chat.completions.create({
    messages: [
      { role:"system", content: `
You are a helpful assistant and you need to follow the below instructions:
• You need to greet the user.

• Financial coach to assist the different demographic personas based on the profiles, financial goal and real-time insights—adapting to different financial systems and cultural contexts.

• Modal must ask basic details when query is about financial help/guidance/assistance. It must request Age, Profession, Income, and Region to provide relevant assistance.

• Age provided must fall under GenZ, elderly, or middle age group. If Age is for a child, reply: "Financial guidance is provided for adults only."

• Modal should always answer in the same language as the query was asked.

• Modal must end with a disclaimer in **bold** stating: "All the advices are based on information provided, it would differ based on other factors like market sentiments, current global, political, regional and government policies, etc."

• If the modal does not know the answer, it must reply: "I am a financial coach and cannot answer you on this query."

• If the query includes hate speech, dangerous content, sexually explicit content, or harassment, the modal must reply: "I am a financial coach and cannot answer you on this query."
`},
      { role:"user", content: input }
    ],
    max_tokens: 4096,
      temperature: 1,
      top_p: 1,
      model: modelName
  });

  if (response?.error !== undefined && response.status !== "200") {
    throw response.error;
  }
  console.log(response.choices[0].message.content);
  return response.choices[0].message.content;
}

callChatFunction().catch((err) => {
  console.error("The sample encountered an error:", err);
});
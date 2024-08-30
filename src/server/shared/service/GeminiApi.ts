import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const API_KEY = process.env.GEMINI_API_KEY as string;

const fileManager = new GoogleAIFileManager(API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

;

export async function analyzeImage(imagePath: string, mimetype: string, measure_type: "WATER" | "GAS"): Promise<number | Error> {
  try {
    // Upload da imagem

    const fullImagePath = __dirname.split("src")[0] + imagePath;

    console.log("Full image path:", fullImagePath);

    const uploadResponse = await fileManager.uploadFile(imagePath, {
      mimeType: mimetype,
      displayName: "Jetpack drawing",
    });

    console.log(
      `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
    );

    let prompt = "";

    if (measure_type === "WATER") prompt = 'A imagem mostra um hidrômetro. Extraia o valor da leitura atual exibida no mostrador e retorne apenas o valor numérico sem casas decimais. Formate a resposta como um JSON, exatamente no seguinte formato: {"measure_value": "valor capturado"}. Certifique-se de que o valor capturado corresponde à leitura exata do hidrômetro.';
    else prompt = 'A imagem mostra um medidor de gas. Extraia o valor da leitura atual exibida no mostrador e retorne apenas o  valor numérico sem casas decimais. Formate a resposta como um JSON, exatamente no seguinte formato: {"measure_value": "valor capturado"}. Certifique-se de que o valor capturado corresponde à leitura exata do medidor de gas.';

    // Generate content using text and the URI reference for the uploaded file.
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri
        }
      },
      { text: prompt},
    ]);

    const generatedText = result.response.text().split("\n");
    const dataJson = JSON.parse(generatedText[1]);

    // console.log("Generated text:", generatedText);
    // console.log("Data extracted from image:", dataJson);

    return Number(dataJson.measure_value);

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Error analyzing image");
  }
}

import { action } from './_generated/server'
import { v } from "convex/values"

const BASE_URL = 'https://api.hume.ai/v0/batch/jobs';
const HUME_API_KEY = 'miqSHRUTrMYw3C8Mg6cXWtu5kRfO51TrGnF1MgiJ8q2LAbRU';
const language = 'en';
const languageModelConfig = {
  "granularity": "sentence"
};

async function processRawText(
  rawText,
  language,
  languageModelConfig
) {
  const MAX_RETRIES = 10; // adjust the number of retries here
  const INITIAL_DELAY_MS = 1000; // starting with 1 second delay

  let delay = INITIAL_DELAY_MS;
  const jobId = await startJob(rawText, language, languageModelConfig);

  // poll with exponential backoff
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const status = await getJobStatus(jobId);

    if (status === 'COMPLETED') {
      console.log('Status is COMPLETED!');
      const predictions = await getPredictions(jobId);
      console.log(predictions);
      return(predictions)
    }
    console.log(`Status is ${status}. Retrying in ${delay / 1000} seconds...`);
    await sleep(delay);
    delay *= 2; // exponential backoff
  }

  console.error('Max retries reached. Giving up.');
}

async function startJob(
  rawText,
  language,
  languageModelConfig
) {
  const body = JSON.stringify({
    text: [rawText],
    models: { language: languageModelConfig },
    transcription: { language },
  });
  const options = { ...buildHumeRequestOptions('POST'), body };
  const response = await fetch(BASE_URL, options);
  if (!response.ok) {
    throw new Error(`Failed to start job: ${response.statusText}`);
  }
  const json = await response.json();
  return json.job_id;
}

async function getJobStatus(jobId) {
  const options = buildHumeRequestOptions('GET');
  const response = await fetch(`${BASE_URL}/${jobId}`, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch job status: ${response.statusText}`);
  }
  const json = await response.json();

  return json.state.status;
}

async function getPredictions(jobId) {
  const options = buildHumeRequestOptions('GET');
  const response = await fetch(`${BASE_URL}/${jobId}/predictions`, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch job predictions: ${response.statusText}`);
  }
  const json = await response.json();
  // setPredictions(json.predictions.results.predictions.models.language.grouped_predictions.predictions.emotions)
  return json[0].results.predictions[0].models.language.grouped_predictions[0].predictions[0];
}

function buildHumeRequestOptions(method) {
  const headers = new Headers();
  headers.append('X-Hume-Api-Key', HUME_API_KEY);
  headers.append('Content-Type', 'application/json');

  return { method, headers };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const fetchPredictions = action({
  args: { transcript: v.string() },
  handler: (ctx, args) => {
    const data = processRawText(args.transcript, language, languageModelConfig)

    return data;
  }
})
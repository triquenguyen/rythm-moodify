const BASE_URL = 'https://api.hume.ai/v0/batch/jobs';

// 1. Set your API Key
const HUME_API_KEY = 'miqSHRUTrMYw3C8Mg6cXWtu5kRfO51TrGnF1MgiJ8q2LAbRU';

// 2. Specify which Language
const language = 'en';

// 3. Specify Language Model configuration
const languageModelConfig = {};

// 4. Copy and paste the text you'd like processed here
const rawTextInput = '';

async function processRawText(
  rawText,
  language,
  languageModelConfig
) {
  const MAX_RETRIES = 5; // adjust the number of retries here
  const INITIAL_DELAY_MS = 1000; // starting with 1 second delay

  let delay = INITIAL_DELAY_MS;
  const jobId = await startJob(rawText, language, languageModelConfig);

  // poll with exponential backoff
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const status = await getJobStatus(jobId);

    if (status === 'COMPLETED') {
      console.log('Status is COMPLETED!');
      const predictions = await getPredictions(jobId);
      console.log(JSON.stringify(predictions));
      return;
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


function buildHumeRequestOptions(method) {
  const headers = new Headers();
  headers.append('X-Hume-Api-Key', HUME_API_KEY);
  headers.append('Content-Type', 'application/json');

  return { method, headers };
}

/**
 * Helper function to support exponential backoff implementation when polling for job status.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
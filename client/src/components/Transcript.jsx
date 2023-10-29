import React, { useEffect, useState } from 'react'
import { useAction } from 'convex/react'
import { api } from "../../convex/_generated/api"
import { fetchPredictions } from '../../convex/getPredictions'
import { fetchEmotions } from '../../convex/getEmotions'

const BASE_URL = 'https://api.hume.ai/v0/batch/jobs';
const HUME_API_KEY = 'miqSHRUTrMYw3C8Mg6cXWtu5kRfO51TrGnF1MgiJ8q2LAbRU';
const language = 'en';
const languageModelConfig = {
  "granularity": "sentence"
};

const Transcript = () => {

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
        return (predictions)
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
  const [transcript, setTranscript] = useState('')
  const [emotions, setEmotions] = useState([])
  const [predictions, setPredictions] = useState([])

  const fetchPredictionsAction = useAction(api.getPredictions.fetchPredictions)
  const fetchEmotionsAction = useAction(api.getEmotions.fetchEmotions)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // const data = await fetchPredictionsAction({ transcript: transcript })

    const data = await processRawText(transcript, language, languageModelConfig)
    setPredictions(data)

    // const emotionsData = await fetchEmotionsAction({ transcript: transcript })
    setEmotions(data.emotions)
  }

  emotions.sort((a, b) => b.score - a.score)

  const topEmotions = emotions.slice(0, 3);

  return (
    <div className="text-white">
      <form onSubmit={handleSubmit} className=' flex flex-col items-center justify-center gap-6'>
        <textarea value={transcript} onChange={e => setTranscript(e.target.value)} className='w-[50vw] h-[50vh] bg-[#022A3B] border-2 border-white rounded-md' placeholder='Paste your transcript here' />
        <button onClick='submit' className='px-3 py-2 border border-[#3cb2f0] rounded-md hover:bg-[#3cb2f0]'>
          Submit
        </button>
      </form>

      <h1 className="text-white">{predictions.text}</h1>
      {topEmotions.map((emotion, index) => (
        <div key={index} className="flex flex-row justify-between">
          <h1 className="text-white">{emotion.name}</h1>
          <h1 className="text-white">{emotion.score}</h1>
        </div>
      ))}
    </div >


  )
}

export default Transcript


import React, { useEffect, useState } from 'react'
import { useAction } from 'convex/react'
import { api } from "../../convex/_generated/api"
import { fetchPredictions } from '../../convex/getPredictions'
import { fetchEmotions } from '../../convex/getEmotions'

const Transcript = () => {
  const [transcript, setTranscript] = useState('')
  const [emotions, setEmotions] = useState([])
  const [predictions, setPredictions] = useState([])

  const fetchPredictionsAction = useAction(api.getPredictions.fetchPredictions)
  const fetchEmotionsAction = useAction(api.getEmotions.fetchEmotions)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await fetchPredictionsAction({ transcript: transcript })
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


import React, { useState } from 'react'

const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

const RecordPredictions = () => {
  const [record, setRecord] = useState(null)

  const handleFileChange = (e) => {
    e.preventDefault()
    setRecord(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    const postUrl = new URL(`${convexSiteUrl}/sendImage`);
    postUrl.searchParams.set("author", "Jack Smith");

    await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": record!.type },
      body: selectedImage,
    });

    setSelectedImage(null);
    imageInput.current!.value = "";
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default RecordPredictions
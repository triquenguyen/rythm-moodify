import requests
from lyricsgenius import Genius
import psycopg
import time
import asyncio
import traceback
import json
import dirtyjson
import random
from retrying import retry
import os

from hume import HumeStreamClient
from hume.models.config import LanguageConfig

url = "https://accounts.spotify.com/api/token"
headers = {
    "Content-Type": "application/x-www-form-urlencoded",
}
data = {
    "grant_type": "client_credentials",
    "client_id": "6667498822ba4ec8bbf0cb719ec7c69c",
    "client_secret": "5d1d0284dfc2423b82d8e7aa6f33454d",
}

response = requests.post(url, headers=headers, data=data)
response = response.json()

token = response['access_token']
token = 'BQASR8_ZWvMVhkf66eNh220DzwrdRLoGjI9DcEOVHxe3EA_VezwwfL0Zu8wJEJ6zJ0huHuSHZkmuM7r9WH-xX8_Q7RTWSCPi0wk45yg1gA0Zo3JY8pg'

data = requests.get('https://api.spotify.com/v1/playlists/1xJHno7SmdVtZAtXbdbDZp/tracks?market=US',headers={"Authorization":'Bearer '+token})

data = data.json()

total = int(data.get('total'))

songs = list()

def get_top_three_scores(dict_list):
    sorted_list = sorted(dict_list, key=lambda x: x['score'], reverse=True)
    return sorted_list[:3]

async def emotion(text_sample):
    try:
        client = HumeStreamClient("k3KreyCvTSHbCDTgAqcGC95K2nGkfOMAGDfGZiYxq0PmNFZL")
        config = LanguageConfig(granularity="sentence")
        async with client.connect([config]) as socket:
                result = await socket.send_text(text_sample)
                emotions = result["language"]["predictions"][0]["emotions"]
                print(f"\n{text_sample}")

                return get_top_three_scores(emotions)
                
    except Exception as e:
        print("Problem with emotion")
        print(e)

async def main():

    conn = psycopg.connect('postgresql://trique:Z-TRgb3ZtnqnSTYYKq91bw@garden-hermit-3692.g95.cockroachlabs.cloud:26257/rythm?sslmode=verify-full')

    for x in range(12):

        name = data.get('items')[x].get('track').get('name')
        artist = data.get('items')[x].get('track').get('artists')[0].get('name')
        
        with conn.cursor() as cur:
            cur.execute('SELECT name FROM rythm.songs WHERE name = %s;', (name,))
            result = cur.fetchone()
            if result is not None:
                continue

        genius = Genius('5aMAFiETHLqQc_AQR4nzGdPwJalnqddmUzKZMEptzUx0xu0CLU1yoQpjEL3-_MLL')
        genius.verbose = False # Turn off status messages
        genius.remove_section_headers = True # Remove section headers (e.g. [Chorus]) from lyrics when searching
        genius.skip_non_songs = False # Include hits thought to be non-songs (e.g. track lists)
        genius.excluded_terms = ["(Remix)", "(Live)"] # Exclude songs with these words in their title
            
        song = genius.search_song(name, artist)
        if song is None:
            continue
        

        e = await emotion(song.lyrics)
        songs.append({'name':name,'artist':artist, 'lyrics':song.lyrics, 'emotion':e})

    for s in songs:

        emotionstring = ""

        try:
            for e in s['emotion']:
                print("Emotion",e)
                emotionstring += e['name'] + " " + str(e['score']) + " "
        except KeyError as e:
            print(f"KeyError: {e}")
        except TypeError as e:
            print(f"TypeError: {e}")
        except Exception as e:
            print(f"Exception: {e}")
        else:
            time.sleep(2)
            print("Emotion String", emotionstring)
        try:
            with conn.cursor() as cur:
                cur.execute("INSERT INTO rythm.songs (name, artist, lyrics, emotion) VALUES (%s, %s, %s, %s)",(s['name'], s['artist'], s['lyrics'], emotionstring))  
            conn.commit()
        except Exception as e:
            print(s["name"])
            print(e)

    conn.close()
    exit()
    def submit_job(s) -> str:
        url = "https://api.together.xyz/inference"
        prompt_list = [
            "[INST] Assume the role of the artist, with the lyrics obtained through web scraping. \nEliminate any sections that do not appear to belong to the song\n " + s['lyrics'] + "\n Provide your answer as a ONLY JSON object in the format: `{'lyrics': ''}` \n Be sure characters like apostrophe are correctly escaped \n Output should be parse-able in Python [/INST]",
            "[INST] Act as the artist, with the lyrics sourced from online web scraping. \nRemove parts that don't seem to be a part of the song\n " + s['lyrics'] + "\n Provide your answer as a ONLY JSON object in the format: `{'lyrics': ''}` \n Be sure characters like apostrophe are correctly escaped \n Output should be parse-able in Python [/INST]",
            "[INST] Assume the identity of the artist, with lyrics acquired through web scraping. \nDiscard any portions that do not seem to be part of the song\n " + s['lyrics'] + "\n Provide your answer as a ONLY JSON object in the format: `{'lyrics': ''}` \n Be sure characters like apostrophe are correctly escaped \n Output should be parse-able in Python [/INST]",
            "[INST] Pretend to be the artist, with the lyrics retrieved from online web scraping. \nEliminate any segments that don't seem to belong to the song\n " + s['lyrics'] + "\n Provide your answer as a ONLY JSON object in the format: `{'lyrics': ''}` \n Be sure characters like apostrophe are correctly escaped \n Output should be parse-able in Python [/INST]",
            "[INST] Take on the persona of the artist, with the lyrics web scraped from online sources. \nRemove any sections that appear to be extraneous to the song\n " + s['lyrics'] + "\n Provide your answer as a ONLY JSON object in the format: `{'lyrics': ''}` \n Be sure characters like apostrophe are correctly escaped \n Output should be parse-able in Python [/INST]"
        ]
        payload = {
            "model": "togethercomputer/llama-2-70b-chat",
            "prompt": prompt_list[random.randint(0,len(prompt_list)-1)],
            "max_tokens": 2000,
            "temperature": 0,
            "async": True
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": "Bearer 7eb768bbb6b19090c591645e0b30343d648a13d91efb50bee3279e70f34704f7"
        }

        submit_response = requests.post(url, json=payload, headers=headers)
        try:
            submit_response.raise_for_status()
        except Exception as e:
            raise Exception(
            f"Together job submission request failed with {submit_response.status_code}: "
            f"{submit_response.text}"
            ) from e
        submit_response_json = submit_response.json()
        job_id = submit_response_json.get("id")
        if not job_id:
            raise Exception(
                f"Could not get job_id from job submission response {submit_response_json}"
            )
        return job_id

    job_list = []


    async def retrieve_job(job_id: str):
        failed = False
        while not failed:
            job_url = f"https://api.together.xyz/jobs/job/{job_id}"
            headers = {
                "accept": "application/json",
                "content-type": "application/json",
                "Authorization": "Bearer 7eb768bbb6b19090c591645e0b30343d648a13d91efb50bee3279e70f34704f7"
            }
            retrieve_response = requests.get(job_url, headers=headers)
            try:
                retrieve_response.raise_for_status()
            except Exception as e:
                # raise Exception(
                #     f"Together job retrieval request failed with {retrieve_response.status_code}: "
                #     f"{retrieve_response.text}"
                # ) from e
                continue
            retrieve_response_json = retrieve_response.json()
            if retrieve_response_json["status"] != "finished":
                # raise Exception(f"Together job not finished: {job_id}")
                continue
            if "output" not in retrieve_response_json:
                # raise Exception(
                #     f"Could not get output from Together job {job_id}: {retrieve_response_json}"
                # )
                continue
            if "error" in retrieve_response_json["output"]:
                error_message = retrieve_response_json["output"]["error"]
                # raise Exception(f"Together request (job_id={job_id}) failed with error: {error_message}")
                continue

            lyrics = retrieve_response.json()

            try:
                lyrics = lyrics['output']['choices'][0]['text']
                for x in range(len(lyrics)):
                    print(x)
                    if lyrics[x] == '{':
                        lyrics = lyrics[x:]
                        break
                print(lyrics)
                for x in range(len(lyrics)-1 , 0, -1):
                    if lyrics[x] == '}':
                        lyrics = lyrics[:x]
                        break

            except Exception as e:
                print(e)

                for s in songs:
                    if s['job_id'] == job_id:
                        s['job_id'] = submit_job(s)
                        job_id = s['job_id']
                        break
                continue
            try: 
                lyrics = dict(json.loads(lyrics))
                lyrics = lyrics['lyrics']
            except Exception as e:
                print("Before emotion")
                print(type(lyrics), lyrics)
                print(e)
                failed = True
                return
            else: 
                print("before emotion")
                e = await emotion(lyrics)
                print("After emotion")
                for s in songs:
                    if s['job_id'] == job_id:
                        s['lyrics'] = lyrics
                        s['emotion'] = e
                        break
            finally:
                if failed:
                    #Delete the dictionary with the job_id
                    print("Exited", job_id)
                    for s in songs:
                        if s['job_id'] == job_id:
                            songs.remove(s)
                            break    
                break   


    tasks = []
    for x in range(len(songs)):
        time.sleep(1)
        job_id = submit_job(songs[x])
        print(job_id)
        songs[x]['job_id'] = job_id
        tasks.append(retrieve_job(job_id))

    await asyncio.gather(*tasks)

    for s in songs:
        print(s)


asyncio.run(main())
conn = psycopg.connect('postgresql://trique:Z-TRgb3ZtnqnSTYYKq91bw@garden-hermit-3692.g95.cockroachlabs.cloud:26257/rythm?sslmode=verify-full')


for s in songs:

    emotionstring = ""

    try:
        for e in s['emotion']:
            print("Emotion",e)
            emotionstring += e['name'] + " " + str(e['score']) + " "
    except KeyError as e:
        print(f"KeyError: {e}")
    except TypeError as e:
        print(f"TypeError: {e}")
    except Exception as e:
        print(f"Exception: {e}")
    else:
        time.sleep(2)
        print("Emotion String", emotionstring)
    try:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO rythm.songs (name, artist, lyrics, emotion) VALUES (%s, %s, %s, %s)",(s['name'], s['artist'], s['lyrics'], emotionstring))  
        conn.commit()
    except Exception as e:
        print(s["name"])
        print(e)

conn.close()


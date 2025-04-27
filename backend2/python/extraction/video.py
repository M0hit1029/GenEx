import whisper
from moviepy import VideoFileClip
import os
import sys
from audio import transcribe_audio  # Assuming transcribe_audio is in a separate script

def transcribe_video(video_path: str, model_size: str = "base") -> str:
    print(f"[Video] Loading video: {video_path}")
    audio_path = "temp_extracted_audio.wav"  # Temporary audio file for transcribing

    try:
        # Extract audio from video
        video = VideoFileClip(video_path)
        print("[Video] Extracting audio...")
        video.audio.write_audiofile(audio_path, verbose=False, logger=None)

        # Transcribe the extracted audio
        print("[Audio] Transcribing audio...")
        text = transcribe_audio(audio_path, model_size)

    except Exception as e:
        print(f"[Error] An error occurred: {str(e)}")
        text = ""  # Return empty text in case of error
    finally:
        # Clean up the temporary audio file
        if os.path.exists(audio_path):
            os.remove(audio_path)

    return text

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe_video.py <video_file>")
        sys.exit(1)
    else:
        video_file = sys.argv[1]
        try:
            # Transcribe the video
            text = transcribe_video(video_file)
            if text:
                print("\n[Transcription Output]:\n")
                print(text)  # Print the transcription result
            else:
                print("[Error] No text transcribed.")
        except Exception as e:
            print(f"[Error] Failed to transcribe video: {str(e)}")
            sys.exit(1)

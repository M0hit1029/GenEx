import whisper
import sys

def transcribe_audio(audio_path: str, model_size: str = "base") -> str:
    print(f"[Audio] Loading model: {model_size}", file=sys.stderr)
    model = whisper.load_model(model_size)

    print(f"[Audio] Transcribing: {audio_path}", file=sys.stderr)
    result = model.transcribe(audio_path)
    return result["text"]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe_audio.py <audio_file>", file=sys.stderr)
        sys.exit(1)  # Exit the script if no file is provided.
    else:
        audio_file = sys.argv[1]
        try:
            text = transcribe_audio(audio_file)
            print("\n[Transcription Output]:\n", file=sys.stderr)
            print(text)  # Print the actual transcription result
        except Exception as e:
            print(f"Error during transcription: {str(e)}", file=sys.stderr)
            sys.exit(1)

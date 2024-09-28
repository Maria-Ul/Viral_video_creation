import datetime
import pandas as pd
import whisper

class Speech2TextConverter:
    model: whisper.model.Whisper = whisper.load_model('small')
    def __init__(self):
        self.result = None

    def make_transcription(self, video_path):
        self.result = Speech2TextConverter.model.transcribe(video_path)

    def save_df_transcript(self, output_path):
        df = pd.DataFrame(self.result['segments'])
        df = df[['id', 'start', 'end', 'text']]
        df.to_csv(output_path)





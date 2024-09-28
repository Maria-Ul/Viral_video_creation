import datetime
import pandas as pd
import whisper

class Speech2TextConverter:
    model: whisper.model.Whisper = whisper.load_model('small')
    def __init__(self):
        self.result = None

    def make_transcription(self, video_path):
        self.result = Speech2TextConverter.model.transcribe(video_path)

    def get_vtt_transcript(self, output_path):
        with open(output_path, 'w') as file:
          for i, segment in enumerate(self.result['segments']):
            file.write(str(i+1)+'\n')
            file.write(str(datetime.timedelta(seconds = segment['start']))+' --> '+str(datetime.timedelta(seconds = segment['end']))+'\n')
            file.write(str(segment['text'].strip()+'\n'))
            file.write('\n')

    def save_df_transcript(self, output_path):
        df = pd.DataFrame(self.result)
        df = df[['id', 'start', 'end', 'text']]
        df.to_csv(output_path)





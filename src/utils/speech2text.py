import datetime
import whisper

class Speech2TextConverter:
    model: whisper.model.Whisper = whisper.load_model('small')
    def __init__(self):
        self.result = None

    def get_transcript(self, video_path, output_path):
        self.result = Speech2TextConverter.model.transcribe(video_path)
        with open(output_path, 'w') as file:
          for i, segment in enumerate(self.result['segments']):
            file.write(str(i+1)+'\n')
            file.write(str(datetime.timedelta(seconds = segment['start']))+' --> '+str(datetime.timedelta(seconds = segment['end']))+'\n')
            file.write(str(segment['text'].strip()+'\n'))
            file.write('\n')


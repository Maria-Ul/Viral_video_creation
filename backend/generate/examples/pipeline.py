from src.xamples.viral_analysis import read_transcript, get_key_segments, segment_and_save_videos
from src.utils.speech2text import Speech2TextConverter
import os

video_file = 'data/movie.mp4'
audio_file = "audio.wav"
output_directory = 'data/processed'
transcript_file = os.path.join(output_directory,'transcript.csv')

os.makedirs(output_directory, exist_ok=True)

model = Speech2TextConverter()
model.make_transcription(video_file)
model.get_df_transcript()

df, text = read_transcript(transcript_file)
key_time_segments = get_key_segments(df, text)
output_file_path = os.path.join(output_directory,"final_video_with_audio.mp4")
segment_and_save_videos(video_file, audio_file, key_time_segments, output_file_path)
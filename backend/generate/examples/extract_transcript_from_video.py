import os
from src.utils.speech2text import Speech2TextConverter


input_file = 'data/movie.mp4'
output_directory = 'data/processed'

os.makedirs(output_directory, exist_ok=True)

model = Speech2TextConverter()
model.make_transcription(input_file)
model.get_df_transcript(os.path.join(output_directory,'transcript.csv'))
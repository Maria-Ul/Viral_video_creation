import os
from src.utils import Speech2TextConverter

input_file = 'data/movie.mp4'
output_directory = 'data/processed'

os.makedirs(output_directory, exist_ok=True)

model = Speech2TextConverter()
model.get_transcript(input_file, output_directory)
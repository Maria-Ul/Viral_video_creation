from src.utils.transcript_processing import TranscriptClassifier
from src.utils.speech2text import Speech2TextConverter

import os

input_file = 'data/movie.mp4'
output_directory = 'data/processed'
os.makedirs(output_directory, exist_ok=True)
datapath = os.path.join(output_directory,'transcript.csv')

model = Speech2TextConverter()
model.make_transcription(input_file)
model.get_df_transcript(datapath)

speech_clf = TranscriptClassifier(datapath)
chunked_text = speech_clf.group_by_semantic_similarity()
speech_clf.classify_by_emotions(chunked_text)
processed_dataframe = speech_clf.data

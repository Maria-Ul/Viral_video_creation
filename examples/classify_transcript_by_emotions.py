from src.utils.transcript_processing import TranscriptClassifier


datapath = '.csv'
speech_clf = TranscriptClassifier(datapath)
chunked_text = speech_clf.group_by_semantic_similarity()
speech_clf.classify_by_emotions(chunked_text)
processed_dataframe = speech_clf.data

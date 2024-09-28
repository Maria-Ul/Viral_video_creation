import pandas as pd
from sentence_transformers import SentenceTransformer, util
from transformers import pipeline


class TranscriptClassifier:
    sentence_llm = SentenceTransformer('DeepPavlov/rubert-base-cased-sentence')
    emotion_classifier = pipeline('text-classification', model='sismetanin/rubert-base-cased-emotion-russian')

    def __init__(self, dataframe):
        self.data = dataframe

    def group_by_semantic_similarity(self):
        embeddings = TranscriptClassifier.sentence_llm.encode(self.data['text'].tolist(), convert_to_tensor=True)

        self.data['group_id'] = -1
        current_group_id = 0
        self.data.at[0, 'group_id'] = current_group_id

        similarity_threshold = 0.7

        combined_texts = []
        current_combined_text = self.data.at[0, 'text']  # Start with the first text

        for i in range(1, len(self.data)):
            similarity = util.pytorch_cos_sim(embeddings[i], embeddings[i - 1]).item()

            if similarity >= similarity_threshold:
                # If similar, combine the texts
                current_combined_text += ' ' + self.data.at[i, 'text']
                self.data.at[i, 'group_id'] = current_group_id  # Same group as previous
            else:
                # If not similar, store the current combined text and start a new group
                combined_texts.append(current_combined_text)
                current_group_id += 1
                self.data.at[i, 'group_id'] = current_group_id  # New group
                current_combined_text = self.data.at[i, 'text']  # Start new combined text

        combined_texts.append(current_combined_text)
        combined_df = pd.DataFrame({
            'group_id': range(len(combined_texts)),
            'combined_text': combined_texts
        })
        return combined_df

    def classify_by_emotions(self, combined_df):
        combined_df['emotion'] = combined_df['text'].apply(lambda x: TranscriptClassifier.emotion_classifier(x)[0]['label'])
        combined_df['emotion_confidence'] = combined_df['text'].apply(lambda x: TranscriptClassifier.emotion_classifier(x)[0]['score'])
        charged_emotions = ['anger', 'joy', 'sadness', 'fear']
        combined_df['emotionally_charged'] = combined_df['emotion'].apply(lambda x: x in charged_emotions)
        self.data = self.data.merge(combined_df[['group_id', 'emotion', 'emotion_confidence']], on='group_id', how='left')

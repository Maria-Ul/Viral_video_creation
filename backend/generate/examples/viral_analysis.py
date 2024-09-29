import pandas as pd
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips
from transformers import AutoModelForSeq2SeqLM, T5TokenizerFast
import os


def read_transcript(file_to_transcript):
    frame = pd.read_csv(file_to_transcript)
    transcript_text = [" ".join(frame['text'].tolist())]
    return frame, transcript_text

def get_key_segments(frame, transcript_text):
    MODEL_NAME = 'UrukHan/t5-russian-summarization'
    MAX_INPUT = 256

    # Загрузка модели и токенизатора
    tokenizer = T5TokenizerFast.from_pretrained(MODEL_NAME)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

    # Входные данные (можно массив фраз или текст)
    input_sequences = transcript_text
    task_prefix = "Spell correct: "  # Токенизирование данных
    if type(input_sequences) != list: input_sequences = [input_sequences]
    encoded = tokenizer(
        [task_prefix + sequence for sequence in input_sequences],
        padding="longest",
        max_length=MAX_INPUT,
        truncation=True,
        return_tensors="pt",
    )

    predicts = model.generate(**encoded.to('cpu'))  # Прогнозирование
    sum_prediction = tokenizer.batch_decode(predicts, skip_special_tokens=True)  # Декодируем данные
    final_summary = sum_prediction
    key_segments = []
    for index, row in frame.iterrows():
      for summary in final_summary:
        for phrase in summary.split():
          if phrase in row['text']:
            key_segments.append(row)
    print('key_segments ', key_segments)
    unique_seg = set([(row['start'], row['end'], row['text']) for row in key_segments])
    # sorted_segments = sorted(unique_seg, key=lambda x: x[0])
    sorted_unique_segments = sorted(unique_seg, key=t)
    return sorted_unique_segments
def t(a):
    return a[0]
#analyzemotions?

def segment_and_save_videos(video_path, audio_path, time_segments, output_dir):
    video_clip = VideoFileClip(video_path)
    video_clip.audio.write_audiofile(audio_path)
    audio_clip = AudioFileClip(audio_path)

    video_clips = []
    # audio_clips = []
    i = 0
    prev_end = 0
    for start_time, end_time, text in (time_segments):
        i+=1
           
        # au_subclip = audio_clip.subclip(start_time, end_time)
        v_subclip = video_clip.subclip(start_time, end_time)

        # Создать аудиофайл для каждого сегмента
        audio_file_path = os.path.join(output_dir, f"audio{str(i).zfill(3)}.wav")
        v_subclip.audio.write_audiofile(audio_file_path)
        au_subclip = AudioFileClip(audio_file_path) 

        v_subclip = v_subclip.set_audio(au_subclip)

        output_file = os.path.join(output_dir, f"output{str(i).zfill(3)}.mp4")
        v_subclip.write_videofile(output_file, codec="libx264", audio_codec="aac")

        video_clips.append(v_subclip)  # Add the video with audio


    # final_clip = concatenate_videoclips(video_clips)
    # output_path = os.path.join(output_dir, f"all_clips_output.mp4")
    # final_clip.write_videofile(output_path, codec="libx264", audio_codec="aac")

    # final_clip.close()

# def crop_video(faces, input_file, output_file):
#     try:
#         if len(faces) > 0:
#             # Constants for cropping
#             CROP_RATIO = 0.9  # Adjust the ratio to control how much of the face is visible in the cropped video
#             VERTICAL_RATIO = 9 / 16  # Aspect ratio for the vertical video
#
#             # Read the input video
#             cap = cv2.VideoCapture(input_file)
#
#             # Get the frame dimensions
#             frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#             frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
#
#             # Calculate the target width and height for cropping (vertical format)
#             target_height = int(frame_height * CROP_RATIO)
#             target_width = int(target_height * VERTICAL_RATIO)
#
#             # Create a VideoWriter object to save the output video
#             fourcc = cv2.VideoWriter_fourcc(*"mp4v")
#             output_video = cv2.VideoWriter(output_file, fourcc, 30.0, (target_width, target_height))
#
#             # Loop through each frame of the input video
#             while True:
#                 ret, frame = cap.read()
#
#                 # If no more frames, break out of the loop
#                 if not ret:
#                     break
#
#                 # Iterate through each detected face
#                 for face in faces:
#                     # Unpack the face coordinates
#                     x, y, w, h = face
#
#                     # Calculate the crop coordinates
#                     crop_x = max(0, x + (w - target_width) // 2)  # Adjust the crop region to center the face
#                     crop_y = max(0, y + (h - target_height) // 2)
#                     crop_x2 = min(crop_x + target_width, frame_width)
#                     crop_y2 = min(crop_y + target_height, frame_height)
#
#                     # Crop the frame based on the calculated crop coordinates
#                     cropped_frame = frame[crop_y:crop_y2, crop_x:crop_x2]
#
#                     # Resize the cropped frame to the target dimensions
#                     resized_frame = cv2.resize(cropped_frame, (target_width, target_height))
#
#                     # Write the resized frame to the output video
#                     output_video.write(resized_frame)
#
#             # Release the input and output video objects
#             cap.release()
#             output_video.release()
#
#             print("Video cropped successfully.")
#         else:
#             print("No faces detected in the video.")
#     except Exception as e:
#         print(f"Error during video cropping: {str(e)}")

# transcription_file = '/content/transcription2.csv'
# video_file = '/content/movie2.mp4'
# audio_file = "audio.wav"

# df, transcripted_text = read_transcript(transcription_file)
# key_time_segments = get_key_segments(df, transcripted_text)

# output_file_path = "final_video_with_audio.mp4"
# segment_and_save_videos(key_time_segments, output_file_path)

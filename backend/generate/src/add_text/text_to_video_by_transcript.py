from moviepy.editor import *
from moviepy.video.tools.subtitles import SubtitlesClip
from moviepy.config import change_settings

change_settings({"IMAGEMAGICK_BINARY": r"C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\\magick.exe"})


# формат subs - [((start_at, end_at), 'TEXT')]
def add_text_by_transcript(
        subs: list,
        inputVideoPath: str,
        outputVideoPath: str,
        fontSize: int = 24,
        color: str = 'white',
        subtitlesPosition: tuple[str, str] = ('center', 'bottom')
):
    generator = lambda txt: TextClip(txt, font='Arial', fontsize=fontSize, color=color)

    subtitles = SubtitlesClip(subs, generator)

    video = VideoFileClip(inputVideoPath)
    result = CompositeVideoClip([video, subtitles.set_pos(subtitlesPosition)])

    result.write_videofile(
        outputVideoPath,
        fps=video.fps,
        temp_audiofile="temp-audio.m4a",
        remove_temp=True, codec="libx264",
        audio_codec="aac"
    )

add_text_by_transcript(subs=[
    ((0, 5), 'TEXT')
],
                       inputVideoPath='input.mp4',
                       outputVideoPath='output.mp4',
                       subtitlesPosition=('center', 'bottom'))

from moviepy.editor import *
from moviepy.video.tools.subtitles import SubtitlesClip
from moviepy.config import change_settings

change_settings({"IMAGEMAGICK_BINARY": r"C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\\magick.exe"})


# "C:\\Users\\Denis\\Documents\\Projects\\CifrPr\\Viral_video_creation\\backend\\generate\\src\\add_text\\input.mp4"
def add_text_by_transcript(
        transcript: list,
        inputVideoPath: str,
        outputVideoPath: str,
        fontSize: int = 24,
        color: str = 'white'
):
    generator = lambda txt: TextClip(txt, font='Arial', fontsize=fontSize, color=color)
    subs = [((0, 4), 'subs1'),
            ((4, 9), 'subs2'),
            ((9, 12), 'subs3'),
            ((12, 16), 'subs4')]

    subtitles = SubtitlesClip(subs, generator)

    video = VideoFileClip(inputVideoPath)
    result = CompositeVideoClip([video, subtitles.set_pos(('center', 'bottom'))])

    result.write_videofile(
        outputVideoPath,
        fps=video.fps,
        temp_audiofile="temp-audio.m4a",
        remove_temp=True, codec="libx264",
        audio_codec="aac"
    )

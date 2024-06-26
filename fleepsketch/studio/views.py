from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import os
import ffmpeg
import json
import base64
from PIL import Image
import tempfile
import shutil  # Added for removing non-empty directories

def process_frames(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            frame_rate = data.get('frameRate')
            frames = data.get('finalFrames')

            # Guardar los fotogramas temporalmente
            temp_dir = os.path.join(tempfile.gettempdir(), 'temp_frames')
            os.makedirs(temp_dir, exist_ok=True)

            frame_paths = []
            for i, frame_data in enumerate(frames):
                if frame_data:
                    # Convertir base64 a bytes
                    frame_bytes = base64.b64decode(frame_data)
                    frame_path = os.path.join(temp_dir, f'frame_{i:04d}.png')
                    with open(frame_path, 'wb') as f:
                        f.write(frame_bytes)
                    frame_paths.append(frame_path)

            # Assuming all frames are the same size, get dimensions of the first frame
            if frame_paths:
                first_frame = frame_paths[0]
                # Load the first frame to get the size
                with Image.open(first_frame) as img:
                    width, height = img.size

                # Ensure width is divisible by 2
                if width % 2 != 0:
                    width += 1

                # Ensure height is divisible by 2
                if height % 2 != 0:
                    height += 1

                # Convertir los fotogramas a mp4
                output_path = os.path.join(tempfile.gettempdir(), 'output.mp4')
                (
                    ffmpeg
                    .input(os.path.join(temp_dir, 'frame_%04d.png'), framerate=frame_rate)
                    .filter('pad', width, height)  # Aplicar el filtro de relleno si es necesario
                    .output(output_path, vcodec='libx264', pix_fmt='yuv420p')
                    .run(overwrite_output=True)  # Asegúrate de que se sobrescriba el archivo si ya existe
                )

                # Limpiar los fotogramas temporales y directorio
                shutil.rmtree(temp_dir)  # Utiliza shutil.rmtree para eliminar todo el directorio

                with open(output_path, 'rb') as f:
                    response = HttpResponse(f.read(), content_type='video/mp4')
                    response['Content-Disposition'] = 'attachment; filename="animation.mp4"'

                os.remove(output_path)
                return response
            else:
                return JsonResponse({'error': 'No frames found'}, status=400)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

def index(request):
    return render(request, 'studio/layout.html')

# from django.shortcuts import render
# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from .models import File, calculate_hash
# from .serializers import FileSerializer

# # Create your views here.

# class FileViewSet(viewsets.ModelViewSet):
#     queryset = File.objects.all()
#     serializer_class = FileSerializer

#     def create(self, request, *args, **kwargs):
#         file_obj = request.FILES.get('file')
#         if not file_obj:
#             return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

#         # 🔸 Compute hash
#         file_hash = calculate_hash(file_obj)

#         # 🔸 Check for duplicates
#         existing_file = File.objects.filter(file_hash=file_hash).first()
#         if existing_file:
#             existing_serialized = self.get_serializer(existing_file)
#             return Response(
#                 {
#                     'message': 'File already exists.',
#                     'file': existing_serialized.data
#                 },
#                 status=status.HTTP_200_OK
#             )

#         # 🔸 Save new file
#         data = {
#             'file': file_obj,
#             'original_filename': file_obj.name,
#             'file_type': file_obj.content_type,
#             'size': file_obj.size,
#             'file_hash': file_hash  # Include hash in data
#         }

#         serializer = self.get_serializer(data=data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)

#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

#     def get_queryset(self):
#         queryset = super().get_queryset()
#         params = self.request.query_params

#         # Search by filename (case-insensitive)
#         search = params.get('q')
#         if search:
#             queryset = queryset.filter(original_filename__icontains=search)

#         # Filter by file_type
#         file_type = params.get('file_type')
#         if file_type:
#             queryset = queryset.filter(file_type=file_type)

#         # Filter by size range
#         min_size = params.get('min_size')
#         max_size = params.get('max_size')
#         if min_size:
#             queryset = queryset.filter(size__gte=int(min_size))
#         if max_size:
#             queryset = queryset.filter(size__lte=int(max_size))

#         # Filter by upload date range
#         start_date = params.get('start_date')
#         end_date = params.get('end_date')
#         if start_date:
#             queryset = queryset.filter(uploaded_at__date__gte=start_date)
#         if end_date:
#             queryset = queryset.filter(uploaded_at__date__lte=end_date)

#         return queryset

from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import File, SpaceTracker, calculate_hash
from .serializers import FileSerializer

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        file_hash = calculate_hash(file_obj)
        existing_file = File.objects.filter(file_hash=file_hash).first()

        if existing_file:
            # Increment space saved
            SpaceTracker.increment_space_saved(file_obj.size)

            # Create new DB entry pointing to same physical file
            duplicate = File.objects.create(
                file=existing_file.file,  # Reference existing file
                original_filename=file_obj.name,
                file_type=file_obj.content_type,
                size=file_obj.size,
                file_hash=file_hash
            )
            serializer = self.get_serializer(duplicate)
            return Response({
                'message': 'Duplicate file uploaded, new record created referencing existing file.',
                'file': serializer.data
            }, status=status.HTTP_201_CREATED)

        # New file case
        data = {
            'file': file_obj,
            'original_filename': file_obj.name,
            'file_type': file_obj.content_type,
            'size': file_obj.size,
            'file_hash': file_hash
        }
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        search = params.get('q')
        if search:
            queryset = queryset.filter(original_filename__icontains=search)

        file_type = params.get('file_type')
        if file_type:
            queryset = queryset.filter(file_type=file_type)

        min_size = params.get('min_size')
        max_size = params.get('max_size')
        if min_size:
            queryset = queryset.filter(size__gte=int(min_size))
        if max_size:
            queryset = queryset.filter(size__lte=int(max_size))

        start_date = params.get('start_date')
        end_date = params.get('end_date')
        if start_date:
            queryset = queryset.filter(uploaded_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(uploaded_at__date__lte=end_date)

        return queryset

    @action(detail=False, methods=['get'], url_path='space-saved')
    def space_saved(self, request):
        tracker, _ = SpaceTracker.objects.get_or_create(id=1)
        return Response({
            'total_space_saved_mb': round(tracker.total_space_saved / (1024 * 1024), 2)
        })


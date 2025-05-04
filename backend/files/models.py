# from django.db import models
# import uuid
# import os
# import hashlib

# def file_upload_path(instance, filename):
#     ext = filename.split('.')[-1]
#     filename = f"{uuid.uuid4()}.{ext}"
#     return os.path.join('uploads', filename)

# def calculate_hash(file):
#     """Generate SHA-256 hash of a file"""
#     sha256 = hashlib.sha256()
#     for chunk in file.chunks():
#         sha256.update(chunk)
#     return sha256.hexdigest()

# class File(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     file = models.FileField(upload_to=file_upload_path)
#     original_filename = models.CharField(max_length=255)
#     file_type = models.CharField(max_length=100)
#     size = models.BigIntegerField()
#     file_hash = models.CharField(max_length=64, unique=True, null=True, blank=True)
#     uploaded_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#     ordering = ['-uploaded_at']
#     indexes = [
#         models.Index(fields=['original_filename']),
#         models.Index(fields=['file_type']),
#         models.Index(fields=['uploaded_at']),
#     ]
    
#     def save(self, *args, **kwargs):
#         if not self.file_hash:
#             self.file_hash = calculate_hash(self.file)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return self.original_filename

from django.db import models
import uuid
import os
import hashlib
from django.db.models import F

def file_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('uploads', filename)

def calculate_hash(file):
    sha256 = hashlib.sha256()
    for chunk in file.chunks():
        sha256.update(chunk)
    return sha256.hexdigest()

class SpaceTracker(models.Model):
    total_space_saved = models.BigIntegerField(default=0)

    def __str__(self):
        return f"Total space saved: {self.total_space_saved} bytes"

    @classmethod
    def increment_space_saved(cls, space_saved: int):
        tracker, _ = cls.objects.get_or_create(id=1)
        tracker.total_space_saved += space_saved
        tracker.save()

class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(upload_to=file_upload_path)
    original_filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100)
    size = models.BigIntegerField()
    file_hash = models.CharField(max_length=64, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['original_filename']),
            models.Index(fields=['file_type']),
            models.Index(fields=['uploaded_at']),
        ]

    def __str__(self):
        return self.original_filename

    def save(self, *args, **kwargs):
        if not self.file_hash:
            self.file_hash = calculate_hash(self.file)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Check if this file is referenced by other File records
        if not File.objects.filter(file=self.file).exclude(id=self.id).exists():
            # If no other files reference this one, we can delete the actual file
            self.file.delete()  # Delete the physical file
        super().delete(*args, **kwargs)

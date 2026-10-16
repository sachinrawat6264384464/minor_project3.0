import os
import io
from typing import Optional
from app.core.config import settings

class ObjectStorageService:
    def __init__(self):
        self._s3_client = None

    def _get_client(self):
        if self._s3_client is None:
            if settings.NEON_OBJECT_STORAGE_ACCESS_KEY and settings.NEON_OBJECT_STORAGE_SECRET_KEY:
                try:
                    import boto3
                    self._s3_client = boto3.client(
                        "s3",
                        endpoint_url=settings.NEON_OBJECT_STORAGE_ENDPOINT,
                        aws_access_key_id=settings.NEON_OBJECT_STORAGE_ACCESS_KEY,
                        aws_secret_access_key=settings.NEON_OBJECT_STORAGE_SECRET_KEY,
                        region_name=settings.NEON_OBJECT_STORAGE_REGION
                    )
                except Exception as e:
                    print(f"Neon Object Storage initialization note: {e}")
                    self._s3_client = False
            else:
                self._s3_client = False
        return self._s3_client

    def upload_file(self, file_bytes: bytes, filename: str, content_type: str = "application/pdf") -> str:
        """
        Uploads file to Neon Object Storage if credentials exist; otherwise saves locally.
        Returns the saved file path or S3 URL.
        """
        client = self._get_client()
        if client and settings.NEON_OBJECT_STORAGE_BUCKET:
            try:
                client.put_object(
                    Bucket=settings.NEON_OBJECT_STORAGE_BUCKET,
                    Key=filename,
                    Body=file_bytes,
                    ContentType=content_type
                )
                endpoint = settings.NEON_OBJECT_STORAGE_ENDPOINT or ""
                return f"{endpoint.rstrip('/')}/{settings.NEON_OBJECT_STORAGE_BUCKET}/{filename}"
            except Exception as e:
                print(f"Error uploading to Neon Object Storage: {e}. Falling back to local storage.")

        # Local fallback
        local_path = os.path.join(settings.UPLOAD_DIR, filename)
        with open(local_path, "wb") as f:
            f.write(file_bytes)
        return local_path

storage_service = ObjectStorageService()

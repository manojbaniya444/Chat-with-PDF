# Chat with pdf

# steps for efficient file uploading to s3
- creating an s3 bucket
- configure policies
- generate a pre signed urls in the backend
- the react app interacts with the backend to get a pre signed url and uploads the file directly to s3
- never expose aws credentials in frontend directly use a presigned url
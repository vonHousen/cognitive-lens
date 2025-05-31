# Using UV - pip/poetry faster replacement

# how to run it

install (macos)
brew install uv

$ uv python install 3.12

Use as pip, just add uv before the command: uv pip install ...

Use for automatic package management:

uv add package-name

uv add --dev pytest

$ uv pip install -r pyproject.toml

# Vertex auth
must be logged in to the account to work with vertex
gcloud auth application-default login
========
- start fastapi app in backend
- start nextjs app in frontend

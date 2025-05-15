# Base image
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

# Set work directory to the root of the project
WORKDIR /app

# Install TeX Live with required packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    # The packages from texlive.packages
    texlive-publishers \  
    # caption is part of texlive-latex-recommended
    # adjustbox and datatool are part of texlive-latex-extra
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker layer caching
COPY ./requirements.txt /app/requirements.txt

RUN pip install --upgrade --progress-bar off pip
# Install dependencies and PyLaTeX
RUN pip install --no-cache-dir --upgrade --progress-bar off -r requirements.txt
RUN pip install --no-cache-dir --upgrade --progress-bar off pylatex

# Copy the rest of the application files to /app
COPY . /app

# Create necessary directories
RUN mkdir -p /app/app/output/latex

# Set environment variables
ENV PYTHONPATH=/app

# Command to run when the container starts
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
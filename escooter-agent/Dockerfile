# Start from a lightweight container with just sh and python
FROM python:3.10.8-alpine
# Install CURL
RUN apk update
RUN apk add curl
# Install our build system Poetry
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
# Make the poetry executable available
ENV PATH="/root/.poetry/bin:${PATH}"
# Copy the program files
WORKDIR /root
COPY it/ it/
COPY app.py .
COPY .python-version .
COPY poetry.lock .
COPY pyproject.toml .
# Install all dependencies
RUN poetry install
# Launch Poetry by default
ENTRYPOINT [ "poetry", "run" ]
# Passing instructions on how to run Flask
CMD [ "python", "app.py" ]

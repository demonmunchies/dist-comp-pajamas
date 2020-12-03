FROM python:3.7
ADD . /pajamas
WORKDIR /pajamas
RUN pip install -r requirements.txt
RUN pip install torch==1.7.0+cpu -f https://download.pytorch.org/whl/torch_stable.html
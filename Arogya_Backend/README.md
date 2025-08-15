# Arogya Setup and Run locally

## Create and activate a virtual environment
Create virtual environment
```bash
python3 -m venv venv
```
Activate Virtual Environment  
For macOS/Linux
```bash
source venv/bin/activate
```
For Windows PowerShell use:
```bash
venv\Scripts\activate
```
## Install project dependencies

```bash
pip install -r requirements.txt
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt Pillow
```
Apply database migrations
```bash
python manage.py migrate
```
Create a superuser to access Django admin
```bash
python manage.py createsuperuser
```
Follow the prompts to create your admin user.

Run the development server
```bash
python manage.py runserver
```
Open your browser at http://127.0.0.1:8000/

Admin site is accessible at http://127.0.0.1:8000/admin/

# Tips
If you add any new dependencies, run pip freeze > requirements.txt to save them.

If you move or copy the project folder, recreate the virtual environment to avoid broken paths.

from django.shortcuts import render
from django.views.generic import TemplateView, DetailView
from api import models
class Home(TemplateView):
    template_name = 'index.html'

class ToDoItem(DetailView):
    context_object_name = 'toDoItem'
    template_name = 'todoitem.html'
    model = models.Task
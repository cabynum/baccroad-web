# README

Here are the steps I used to configure the project.  Everything mentioned in this installation process has already been done/configured.  This text is purely to document the process.

## Installation

### New project

* create the application

```
$ rails new baccroad-web -d mysql
```

* generate the database

```
$ rake db:create db:migrate
```
### Install Piggybak

* add the following gems to the Gemfile

```ruby
gem 'piggybak'
gem 'cancan'
```

* install the bundle and and install piggybak from the command prompt

```
$ bundle install
$ piggybak install
```

RailsAdmin and Devise are both installed with the Piggybak installation.  I'm using Can Can for authorization so I added that gem to the Gemfile as well.

### Configure the Devise Mailer

Devise uses a mailer as a part of the authentication process.  *default_url_options* needs to be set appropriately for the different environments.  I added the following line for my development environment in *config/environments/development.rb*:

```ruby
config.action_mailer.default_url_options = { host: 'localhost:3000' }
```

### Add Devise Views

Devise comes with some views OOTB that I can use for customization.  Here is the line to generate them:

```
$ rails generate devise:views
```

### Create the Landing Page

```
$ rails generate controller home index
```

Then added this line to *config/routes.rb*

```ruby
root 'home#index'
```

### Add Flash Messages

I added the tages for flash messages to *app/views/layouts/application.html.erb*

```html
<p class="notice"><%= notice %></p>
<p class="alert"><%= alert %></p>
 ```
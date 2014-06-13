# README

Here are the steps I used to configure the project.  Everything mentioned in this installation process has already been done/configured.  This text is purely to document the process...I'll probably just move it to a blogpost once I'm finished.

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

RailsAdmin and Devise are both installed with the Piggybak installation.  I'm using CanCan for authorization so I added that gem to the Gemfile as well.

### Configure the Devise Mailer

Devise uses a mailer as a part of the authentication process.  **default\_url\_options** needs to be set appropriately for the different environments.  I added the following line for my development environment in **config/environments/development.rb**:

```ruby
config.action_mailer.default_url_options = { host: 'localhost:3000' }
```

### Generate a devise user

```
$ rails generate devise user
```

Rails creates a user model and configures it with Devise modules. It also creates a migration file located in **db/migrate/devise\_create\_users.rb**.

```
$ rake db:migrate
```

This tells rails to create a table called users.

* install piggybak migrations
```
$ rake piggybak:install:migrations
$ rake db:migrate
```

Uncomment the following lines in **config/initializers/rails_admin.rb**

```ruby
config.authenticate_with do
    warden.authenticate! scope: :user
  end
  config.current_user_method(&:current_user)
```

**\*\*WARNING:**   There may be an existing **add\_devise\_to\_users.rb** migration.  I deleted this as it looked like a duplicate to **devise\_create\_users.rb**

**\*\*WARNING:**   I ran into an error where **piggybak\_line\_item** table does not exist.  I found the **add\_price\_to\_line\_item.rb** migration and added this bit of code...

```ruby
Piggybak::LineItem.class_eval do
      self.table_name = 'line_items'
    end
```

**\*\*WARNING:** There is a migration for a rearchitecture of the **line\_item**.  It's unclear to me why both the rearchitecture migration and original line_item migration are both in place, unless the creator is just unaware that the rearchitecture migration causes errors when it tries to recreate the **created\_at** and **updated\_at** columns in the table.  To get past this error I commented out the following in the **line\_item\_rearchitecture.piggybak.rb** file

```ruby
=begin
    change_table(:line_items) do |t|
      t.timestamps
    end
=end
```

### Verify sign-up pages

By default, devise created the following pages:

[http://localhost:3000/users/sign_up](http://localhost:3000/users/sign_up)

[http://localhost:3000/users/sign_in](http://localhost:3000/users/sign_in)

### Add login links to the landing page

I created a partial file **app/views/layouts/\_login.html.erb** with following content:

```erb
<% if signed_in? %>
    Logged in as <%= current_user.email %>.
    <%= link_to "Logout", destroy_user_session_path, method: :delete %>
    | <%= link_to "Admin", '/admin' %>
<% else %>
    <%= link_to "Login", new_user_session_path %> | <%= link_to "Sign up now!", new_user_registration_path %>
<% end %>
```

To add it to my other views, I added the following to *app/views/layouts/application.html.erb*:

```erb
<%= render partial: 'layouts/login' %>
```

### Add role to User model

```
$ rails g migration add_role_to_users role:string
```

The following was output to the terminal:

```
	invoke  active_record
	create    db/migrate/20140531165029_add_role_to_users.rb
```

I added the following to the migration created above:

```ruby
class AddRoleToUsers < ActiveRecord::Migration
    def change
        add_column :users, :role, :string
 
        User.create! do |u|
            u.email     = 'cbynum@gmail.com'
            u.password    = 'admin123'
            u.role = 'administrator'
        end
    end
end
```

I excuted the migration to create an example **administrator** user with email **cbynum@gmail.com** and password **admin123**.

```
$ rake db:migrate
```

To access this role, I added the following method to **app/models/user.rb**

```ruby
def role?(r)
    role.include? r.to_s
  end
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

Then added this line to **config/routes.rb**

```ruby
root 'home#index'
```

### Add Flash Messages

I added the tags for flash messages to **app/views/layouts/application.html.erb**

```html+erb
<p class="notice"><%= notice %></p>
<p class="alert"><%= alert %></p>
 ```

### Configure CanCan

At this point anyone should be able to access the administration portion of the site at

[http://localhost:3000/admin](http://localhost:3000/admin)

At this point I locked down that portion of the website so that only site adminstrators can access it.

For authorization I used the cancan gem.  The permissions are driven through an **ability class** that can be generated from the command line as follows:

```
$ rails generate cancan:ability
```

I had to edit the ability class at **app/models/ability.rb**

```ruby
def initialize(user)

    if user && user.role?(:administrator)
      can :dashboard
      can :access, :rails_admin
      can :manage, [User]
      can :manage, Piggybak.config.manage_classes.map(&:constantize)
      Piggybak.config.extra_abilities.each do |extra_ability|
        can extra_ability[:abilities], extra_ability[:class_name].constantize
      end
    end
```

I also had to edit the rails_admin configuration at **config/initializers/rails_admin.rb** to tell my app to use cancan with rails_admin.

```ruby
RailsAdmin.config do |config|
  config.authorize_with :cancan
end
```

### Integrating with Piggybak

How to make use of the most basic of integration points with the piggybak gem (how to sell an item), is outlined pretty well in the [http://www.piggybak.org/documentation.html#integration](piggybak integration points documentation).

**acts_as_orderer** and **acts_as_sellable** are the two most rudimentary integration points.  Our user model will act as the orderer, and I needed to create a product (or item) model to have something to sell.

user model now looks like...

```ruby
class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  acts_as_orderer
        
  def role?(r)
    role.include? r.to_s
  end
end
```

then i generated a product model...

```
$ rails generate model product name:string description:text
```

after adding the piggybak integration, product looks like...

```ruby
class Product < ActiveRecord::Base
    acts_as_sellable
end
```
run db migrations to create the new products table

```
$ rake db:migrate
```

we'd like to be able to add and remove products from the rails_admin console, so I needed to update cancan's ability class with the proper permissions

```ruby
can :manage, [Product]
```

after restarting the server, you should now be able to see the Products model in the rails_admin console

Now, to get the attributes that come with piggybak's sellable models there is no longer a need to add **attr_accessible :piggybak_sellable_attributes** to the model class.  This will no longer work for the mass copy of attributes in rails 4.  What's needed is to add the following to *rails_admin.rb*:

```ruby
config.model Product do
    list do
      field :name
      field :description
    end
    edit do
      field :name
      field :description
      field :piggybak_sellable
    end
  end
```

## Project Details

### User Accounts

username: admin@baccroad.com
password: 'admin123'
role: administrator

username: customer@baccroad.com
password: 'customer123'
role: customer
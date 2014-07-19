class Product < ActiveRecord::Base
	attr_accessible :piggybak_sellable_attributes
	acts_as_sellable
end
class Product < ActiveRecord::Base

	validates_presence_of :name

	attr_accessible :name, :image, :piggybak_sellable_attributes, :delete_image

	has_attached_file :image, 
    :url => "/system/:attachment/:id/:style/:basename.:extension",
    :path => ":rails_root/public/system/:attachment/:id/:style/:basename.:extension",
    :styles => { 
    	:thumb => ['100x100#',  :jpg, :quality => 70],
    	:small => ['150x150#',  :jpg, :quality => 70],
    	:medium => ['480x480#',  :jpg, :quality => 70],
    	:large => ['600x600#',  :jpg, :quality => 70]
    }

    validates_attachment :image, content_type: { content_type: ["image/jpg", "image/jpeg", "image/png", "image/gif"] }

	attr_accessor :delete_image
    before_validation { self.image.clear if self.delete_image == '1' }

	acts_as_sellable
end
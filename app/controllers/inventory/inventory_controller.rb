class Inventory::InventoryController < ApplicationController
  before_filter :authenticate
  
  def index
    render
  end
end
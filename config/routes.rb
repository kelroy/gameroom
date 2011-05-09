Gameroom::Application.routes.draw do
  
  namespace 'api' do
    resources :addresses do
      collection do
        match 'search' => 'addresses#search', :via => [:get, :post]
        match 'where' => 'addresses#where', :via => [:get, :post]
      end
    end
    resources :customers do
      collection do
        match 'search' => 'customers#search', :via => [:get, :post]
        match 'where' => 'customers#where', :via => [:get, :post]
      end
      resources :transactions, :only => [:index]
    end
    resources :emails do
      collection do
        match 'search' => 'emails#search', :via => [:get, :post]
        match 'where' => 'emails#where', :via => [:get, :post]
      end
    end
    resources :entries do
      collection do
        match 'search' => 'entries#search', :via => [:get, :post]
        match 'where' => 'entries#where', :via => [:get, :post]
      end
    end
    resources :items do
      collection do
        match 'search' => 'items#search', :via => [:get, :post]
        match 'where' => 'items#where', :via => [:get, :post]
      end
      resources :lines,       :only => [:index]
      resources :properties,  :only => [:index, :create]
    end
    resources :lines do
      collection do
        match 'search' => 'lines#search', :via => [:get, :post]
        match 'where' => 'lines#where', :via => [:get, :post]
      end
    end
    resources :payments do
      collection do
        match 'search' => 'payments#search', :via => [:get, :post]
        match 'where' => 'payments#where', :via => [:get, :post]
      end
    end
    resources :people do
      collection do
        match 'search' => 'people#search', :via => [:get, :post]
        match 'where' => 'people#where', :via => [:get, :post]
      end
      resource  :customer,  :only => [:show]
      resource  :employee,      :only => [:show]
      resources :addresses, :only => [:index]
      resources :emails,    :only => [:index]
      resources :phones,    :only => [:index]
    end
    resources :phones do
      collection do
        match 'search' => 'phones#search', :via => [:get, :post]
        match 'where' => 'phones#where', :via => [:get, :post]
      end
    end
    resources :properties do
      collection do
        match 'search' => 'properties#search', :via => [:get, :post]
        match 'where' => 'properties#where', :via => [:get, :post]
      end
    end
    resources :timecards do
      collection do
        match 'search' => 'timecards#search', :via => [:get, :post]
        match 'where' => 'timecards#where', :via => [:get, :post]
      end
    end
    resources :transactions do
      collection do
        match 'search' => 'transactions#search', :via => [:get, :post]
        match 'where' => 'transactions#where', :via => [:get, :post]
      end
      member do
        match 'receipt' => 'transactions#receipt', :via => [:get]
      end
      resources :payments,  :only => [:index]
      resources :lines,     :only => [:index]
    end
    resources :tills do
      collection do
        match 'search' => 'tills#search', :via => [:get, :post]
        match 'where' => 'tills#where', :via => [:get, :post]
      end
      member do
        match 'balance' => 'tills#balance', :via => [:get]
      end
      resources :entries,       :only => [:index]
      resources :transactions,  :only => [:index]
    end
    resources :employees do
      member do
        match 'stamp' => 'employees#stamp', :via => [:get, :post]
      end
      collection do
        match 'in' => 'employees#in', :via => [:get]
        match 'out' => 'employees#out', :via => [:get]
        match 'search' => 'employees#search', :via => [:get, :post]
        match 'where' => 'employees#where', :via => [:get, :post]
        match 'authenticate' => 'employees#authenticate', :via => [:post]
      end
      resources :entries,       :only => [:index]
      resources :timecards, :only => [:index]
    end
  end
  
  root :to => "terminal#index"
  match '*path', :to => redirect("/")
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => "welcome#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end

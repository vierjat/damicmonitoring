require 'sinatra'
require 'slim'
require 'sass'
require 'tempodb'
require 'date'

get('/styles.css'){ scss :styles }

get '/' do
  client = TempoDB::Client.new("de51a535fd794beb9c18248c7e407305", "f9f49e13ec25459ea9e16edadc3252a7")
  start = Time.now - 10800
  stop = Time.now

  data_set_temp = client.read_key("temperature", start, stop, :interval => "0.5min", :function => "max")
  
  data_set_pres = client.read_key("pressure", start, stop, :interval => "0.5min", :function => "max")
  
  @maxTemp = 0;
  @minTemp = 1000;
  @data =""
  for event in data_set_temp.data
    if event.value > 0
      @data = @data + ", [new Date('#{event.ts}'), #{event.value}, null]"
      if event.value > @maxTemp
        @maxTemp = event.value
      end
      if event.value < @minTemp
        @minTemp = event.value
      end
    end
  end
  @maxTemp = @maxTemp+1
  @minTemp = @minTemp-1
  
  for event in data_set_pres.data
    if event.value > -1000
      @data = @data + ", [new Date('#{event.ts}'), null, #{event.value}]"
    end
  end
  
#   puts @data
  
  erb :home
end

get '/about' do
  @title = "All About This Website"
  
  erb :about
end

get '/contact' do
  erb :contact
end

not_found do
  erb :not_found
end

require 'sinatra'
require 'slim'
require 'sass'
require 'tempodb'
require 'date'
require 'json'

get('/styles.css'){ scss :styles }

get '/' do
  erb :home
end

get '/cubes' do
  erb :cubes
end

get '/connie' do
  erb :connie
end

get '/time' do
  erb :cubes
end

get '/getData' do

  client = TempoDB::Client.new("de51a535fd794beb9c18248c7e407305", "f9f49e13ec25459ea9e16edadc3252a7")
  stop = Time.parse(params[:date])
  start = stop - 4*60*60

  data_set_temp = client.read_key("temperature", start, stop, :interval => "0.5min", :function => "max")

  data_set_pres = client.read_key("pressure", start, stop, :interval => "0.5min", :function => "max")

  maxTemp = 0;
  minTemp = 1000;

  data = {}

  data[:temp] = data_set_temp.data.map do |event|
    next if event.value <= 0
    if event.value > maxTemp
      maxTemp = event.value
    elsif event.value < minTemp
      minTemp = event.value
    end
    {ts: event.ts.to_i * 1000, value: event.value}
  end

  maxTemp = maxTemp+1
  minTemp = minTemp-1

  data[:pres] = data_set_pres.data.map do |event|
    if event.value > -1000
      {ts: event.ts.to_i * 1000, value: event.value}
    end
  end

  data[:minTemp] = minTemp
  data[:maxTemp] = maxTemp

  data.to_json
end


get '/getDataCube' do

  client = TempoDB::Client.new("a799946202084e40b22b30b0d1343610", "8da61dd6da634c08b08016d6cbe7562e")
  start = Time.now - 10800
  stop = Time.now

  data_set_temp = client.read_key("temp2", start, stop, :interval => "0.5min", :function => "max")

  data_set_pres = client.read_key("htr2", start, stop, :interval => "0.5min", :function => "max")

  maxTemp = 0;
  minTemp = 1000;

  data = "{"
  data = data + "  \"cols\": [{\"id\": \"Date\", \"label\": \"Date\", \"type\": \"datetime\"},"
  data = data + "           {\"id\": \"Temp\", \"label\": \"Temperature\", \"type\": \"number\"},"
  data = data + "           {\"id\": \"Pres\", \"label\": \"Heater power\", \"type\": \"number\"} ],"
  data = data + "\"rows\": ["

  for event in data_set_temp.data
    if event.value > 0
      data = data + "{\"c\":[ {\"v\": \"Date(#{event.ts.to_i * 1000})\"}, {\"v\": #{event.value}}, {\"v\": \"null\"}]},"
      if event.value > maxTemp
        maxTemp = event.value
      end
      if event.value < minTemp
        minTemp = event.value
      end
    end
  end
  maxTemp = maxTemp+1
  minTemp = minTemp-1

  for event in data_set_pres.data
    if event.value > -1000
      data = data + "{\"c\":[ {\"v\": \"Date(#{event.ts.to_i * 1000})\"}, {\"v\": \"null\"}, {\"v\": #{event.value}}]} ,"
    end
  end

  data = data[0..-2]

#   puts data

  plotTitle = "CUBE monitoring data (last three hours): #{Time.now}"

  data = data + "]"
  data = data + ",\"p\": {\"plotTitle\": \"#{plotTitle}\", \"minTemp\": #{minTemp}, \"maxTemp\": #{maxTemp}}"

  data = data + "}"
end


get '/getDataConnie' do

  client = TempoDB::Client.new("bbf7689aff284d8b990ab075ea60908a", "aeda3ba92f6c43a4954e37e8a4eb7edc")
  start = Time.now - 10800
  stop = Time.now

  data_set_temp = client.read_key("temp", start, stop, :interval => "0.5min", :function => "max")

  data_set_pres = client.read_key("htr", start, stop, :interval => "0.5min", :function => "max")

  maxTemp = 0;
  minTemp = 1000;

  data = "{"
  data = data + "  \"cols\": [{\"id\": \"Date\", \"label\": \"Date\", \"type\": \"datetime\"},"
  data = data + "           {\"id\": \"Temp\", \"label\": \"Temperature\", \"type\": \"number\"},"
  data = data + "           {\"id\": \"Pres\", \"label\": \"Heater power\", \"type\": \"number\"} ],"
  data = data + "\"rows\": ["

  for event in data_set_temp.data
    if event.value > 0
      data = data + "{\"c\":[ {\"v\": \"Date(#{event.ts.to_i * 1000})\"}, {\"v\": #{event.value}}, {\"v\": \"null\"}]},"
      if event.value > maxTemp
        maxTemp = event.value
      end
      if event.value < minTemp
        minTemp = event.value
      end
    end
  end
  maxTemp = maxTemp+1
  minTemp = minTemp-1

  for event in data_set_pres.data
    if event.value > -1000
      data = data + "{\"c\":[ {\"v\": \"Date(#{event.ts.to_i * 1000})\"}, {\"v\": \"null\"}, {\"v\": #{event.value}}]} ,"
    end
  end

  data = data[0..-2]

#   puts data

  plotTitle = "CONNIE monitoring data (last three hours): #{Time.now}"

  data = data + "]"
  data = data + ",\"p\": {\"plotTitle\": \"#{plotTitle}\", \"minTemp\": #{minTemp}, \"maxTemp\": #{maxTemp}}"

  data = data + "}"
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


function fetch(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      cb && cb(xhr.responseText);
    }
  };
}

var canvas = new Le5leTopology.Topology('topology', {
  on: function(event, data) {
    // messages
  }
});

fetch('/data.json', function(text) {
  var data = JSON.parse(text);
  data.locked = 1;
  canvas.open(data);
});

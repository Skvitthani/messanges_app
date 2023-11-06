const sendNotification = data => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key=AAAAjRO5uSY:APA91bEpT0FRuaMfWuxtRxX6jo6kvQaD0rpSMgarQWLjIGUT0YgqVGQBLyK8nQMMr6ZafwMpCUJiG6Hw9s0rnUsfwljZT-5ZnSuK7YbjALM6bTz1CmpDAsrtS7VM5Rz4PRq5yHBNLLOg',
  );

  var raw = JSON.stringify({
    data: {
      title: `${data.name} send you a friend request`,
      image: data?.image,
    },
    to: data?.token,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

export default {sendNotification};

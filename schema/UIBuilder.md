# Vurnable js injection


# example

```html
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Login</title>
    <link href="/resource/css/main.css" rel="stylesheet" />
    <script src="/resource/js/jquery-3.7.1.min.js"></script>
  </head>
  <body class="bg-body-tertiary">
    <div id="bg" style="overflow: hidden;">
      <img src="/resource/imgs/bg.jpg" class="w-100 h-100" />
    </div>
    <div id="main">
      <div id="body">
        <div class="w-75 h-50 flex flex-column">
          <div class="mb-4 input-group flex-nowrap mb-2 justify-content-center">
            <img
              class="rounded-circle"
              src="/resource/imgs/student.jpg"
              style="width: 200px;"
            />
          </div>

          <div class="h-45px input-group flex-nowrap mb-2">
            <span class="input-group-text" id="addon-wrapping">
              <i class="bi bi-person"></i>
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="User ID"
              aria-label="UserId"
              aria-describedby="addon-wrapping"
            />
          </div>

          <div class="input-group flex-nowrap mb-2 h-45px">
            <span class="input-group-text" id="addon-wrapping">
              <i class="bi bi-file-earmark-lock"></i>
            </span>
            <input
              type="password"
              class="form-control"
              placeholder="password"
              aria-label="password"
              aria-describedby="addon-wrapping"
            />
          </div>

          <div class="input-group flex-nowrap mt-5 flex justify-content-center">
            <button
              class="btn bg-primary text-white"
              style="width: 100px; height: 44px;"
            >
              <i class="bi bi-arrow-right-circle-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="popup"></div>
    <script src="/resource/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="/resource/js/main.js"></script>
  </body>
</html>
```

# Find requrment

```html
<link href="/resource/css/main.css" rel="stylesheet" />
<script src="/resource/js/jquery-3.7.1.min.js"></script>
<script src="/resource/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="/resource/js/main.js"></script>
```
```json
        "requrment":["main-css","jq-js","bootstrap-css","main-js"],
```
## remove Structure part

```html
<div class="w-75 h-50 flex flex-column">
  <div class="mb-4 input-group flex-nowrap mb-2 justify-content-center">
    <img
      class="rounded-circle"
      src="/resource/imgs/student.jpg"
      style="width: 200px;"
    />
  </div>

  <div class="h-45px input-group flex-nowrap mb-2">
    <span class="input-group-text" id="addon-wrapping">
      <i class="bi bi-person"></i>
    </span>
    <input
      type="text"
      class="form-control"
      placeholder="User ID"
      aria-label="UserId"
      aria-describedby="addon-wrapping"
    />
  </div>

  <div class="input-group flex-nowrap mb-2 h-45px">
    <span class="input-group-text" id="addon-wrapping">
      <i class="bi bi-file-earmark-lock"></i>
    </span>
    <input
      type="password"
      class="form-control"
      placeholder="password"
      aria-label="password"
      aria-describedby="addon-wrapping"
    />
  </div>

  <div class="input-group flex-nowrap mt-5 flex justify-content-center">
    <button
      class="btn bg-primary text-white"
      style="width: 100px; height: 44px;"
    >
      <i class="bi bi-arrow-right-circle-fill"></i>
    </button>
  </div>
</div>
```
### Make Componet Code
```json
[
    {
        "perent":"#body",
        "requrment":["main-css","jq-js","bootstrap-css","main-js"],
        "name":"div",
        "attribute":{
            "class":"w-75 h-50 flex flex-column"
        },

        "children":[
            {
                "name":"div",
                "attribute":
                [
                    "class":"mb-4 input-group flex-nowrap mb-2 justify-content-center"
                ],
                "children":[
                    {
                        "name":"img",
                        "src":"student-img",
                        "attribute":[
                            "class":"rounded-circle",
                            "style":"width: 200px;",
                        ]
                    }
                ]
            },

            {
                "name":"div",
                "attribute":[
                    "class":"h-45px input-group flex-nowrap mb-2"
                ],
                "children":[
                    {
                        "name":"span",
                        "attribute":[
                            "class":"input-group-text"
                        ],
                        "children":[
                            {
                                "name":"i",
                                "attribute":{
                                    "class":"bi bi-person"
                                }
                            }
                        ]
                    },
                    {
                        "name":"input",
                        "attribute":[
                            "type":"text",
                            "class":"form-control",
                            "placeholder":"User ID",
                            "aria-label":"UserId",
                            "aria-describedby":"addon-wrapping"
                        ]
                    }
                ]
            },

            {
                "name":"div",
                "attribute":[
                    "class":"input-group flex-nowrap mb-2 h-45px"
                ],
                "children":[
                    {
                        "name":"span",
                        "attribute":[
                            "class":"input-group-text"
                        ],
                        "children":[
                            {
                                "name":"i",
                                "attribute":[
                                    "class":"bi bi-file-earmark-lock"
                                ]
                            }
                        ]
                    },
                    {
                        "name":"input",
                        "attribute":[
                            "type":"password",
                            "class":"form-control",
                            "placeholder":"password",
                            "aria-label":"password",
                            "aria-describedby":"addon-wrapping"
                        ]
                    }
                    
                ]
            },
            {
                "name":"div",
                "attribute":[
                    "class":"input-group flex-nowrap mt-5 flex justify-content-center"
                ],
                "children":[
                    {
                        "name":"button",
                        "attribute":[
                            "class":"btn bg-primary text-white",
                            "style","width: 100px; height: 44px;"
                        ],
                        "children":{
                            {
                                "name":"i",
                                "attribute":[
                                    "class":"bi bi-arrow-right-circle-fill"
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    }
]
```
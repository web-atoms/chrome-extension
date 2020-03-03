// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The function below is executed in the context of the inspected page.
var page_getProperties = function() {
  // Make a shallow copy with a null prototype, so that sidebar does not
  // expose prototype.

      var t = $0;
      var e = $0;

      while (t && !t.atomControl) {
          t = t.parentNode;
      }
      if (!t)
          return { "__type": "None" };
      t = t.atomControl;

      // this is TSX based new Web Atoms
      if (t.app) {
          return t;
      }

      var copy = { "__baseType": t.constructor.__baseType };
      copy["__type"] = t.constructor.__typeName;
      copy["__baseTypeName"] = t.constructor.__baseType ? t.constructor.__baseType.__typeName : "" ;

      for (var k in t) {
          if (/^get_/gi.test(k)) {
              var f = t[k];
              var n = k.substr(4);
              if (/^(events|children|owner|visible|cssPrefix)/gi.test(n))
                  continue;
              var v = undefined;
              try {
                  v = f.apply(t);
              } catch (err) {
                  v = "Error executing " + k + ":" + err.toString();
              }
              if (v !== undefined) {
                  copy[n] = v;
              }
          }
      }

      var bs = t.bindings;
      if (bs) {
          copy["bindings"] = bs;
          for (var i = 0; i < bs.length; i++) {
              var b = bs[i];
              if (b.element === e) {
                  copy["__binding"] = b;
                  break;
              }
          }
      }

    return copy;
}

chrome.devtools.panels.elements.createSidebarPane(
    "Web Atoms Properties",
    function (sidebar) {
        function updateElementProperties() {
            sidebar.setExpression("(" + page_getProperties.toString() + ")()");
        }
        updateElementProperties();

        chrome.devtools.panels.elements.onSelectionChanged.addListener(
            updateElementProperties);
    });

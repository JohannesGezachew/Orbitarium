import {
  Controls,
  MOUSE,
  MathUtils,
  Plane,
  Quaternion,
  Ray,
  Spherical,
  TOUCH,
  Vector2,
  Vector3
} from "./chunk-Z7OYAWFU.js";
import "./chunk-BUSYA2B4.js";

// node_modules/three/examples/jsm/controls/OrbitControls.js
var _changeEvent = { type: "change" };
var _startEvent = { type: "start" };
var _endEvent = { type: "end" };
var _ray = new Ray();
var _plane = new Plane();
var _TILT_LIMIT = Math.cos(70 * MathUtils.DEG2RAD);
var _v = new Vector3();
var _twoPI = 2 * Math.PI;
var _STATE = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
};
var _EPS = 1e-6;
var OrbitControls = class extends Controls {
  constructor(object, domElement = null) {
    super(object, domElement);
    this.state = _STATE.NONE;
    this.enabled = true;
    this.target = new Vector3();
    this.cursor = new Vector3();
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.minZoom = 0;
    this.maxZoom = Infinity;
    this.minTargetRadius = 0;
    this.maxTargetRadius = Infinity;
    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI;
    this.minAzimuthAngle = -Infinity;
    this.maxAzimuthAngle = Infinity;
    this.enableDamping = false;
    this.dampingFactor = 0.05;
    this.enableZoom = true;
    this.zoomSpeed = 1;
    this.enableRotate = true;
    this.rotateSpeed = 1;
    this.enablePan = true;
    this.panSpeed = 1;
    this.screenSpacePanning = true;
    this.keyPanSpeed = 7;
    this.zoomToCursor = false;
    this.autoRotate = false;
    this.autoRotateSpeed = 2;
    this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" };
    this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };
    this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object.zoom;
    this._domElementKeyEvents = null;
    this._lastPosition = new Vector3();
    this._lastQuaternion = new Quaternion();
    this._lastTargetPosition = new Vector3();
    this._quat = new Quaternion().setFromUnitVectors(object.up, new Vector3(0, 1, 0));
    this._quatInverse = this._quat.clone().invert();
    this._spherical = new Spherical();
    this._sphericalDelta = new Spherical();
    this._scale = 1;
    this._panOffset = new Vector3();
    this._rotateStart = new Vector2();
    this._rotateEnd = new Vector2();
    this._rotateDelta = new Vector2();
    this._panStart = new Vector2();
    this._panEnd = new Vector2();
    this._panDelta = new Vector2();
    this._dollyStart = new Vector2();
    this._dollyEnd = new Vector2();
    this._dollyDelta = new Vector2();
    this._dollyDirection = new Vector3();
    this._mouse = new Vector2();
    this._performCursorZoom = false;
    this._pointers = [];
    this._pointerPositions = {};
    this._controlActive = false;
    this._onPointerMove = onPointerMove.bind(this);
    this._onPointerDown = onPointerDown.bind(this);
    this._onPointerUp = onPointerUp.bind(this);
    this._onContextMenu = onContextMenu.bind(this);
    this._onMouseWheel = onMouseWheel.bind(this);
    this._onKeyDown = onKeyDown.bind(this);
    this._onTouchStart = onTouchStart.bind(this);
    this._onTouchMove = onTouchMove.bind(this);
    this._onMouseDown = onMouseDown.bind(this);
    this._onMouseMove = onMouseMove.bind(this);
    this._interceptControlDown = interceptControlDown.bind(this);
    this._interceptControlUp = interceptControlUp.bind(this);
    if (this.domElement !== null) {
      this.connect();
    }
    this.update();
  }
  connect() {
    this.domElement.addEventListener("pointerdown", this._onPointerDown);
    this.domElement.addEventListener("pointercancel", this._onPointerUp);
    this.domElement.addEventListener("contextmenu", this._onContextMenu);
    this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: false });
    const document = this.domElement.getRootNode();
    document.addEventListener("keydown", this._interceptControlDown, { passive: true, capture: true });
    this.domElement.style.touchAction = "none";
  }
  disconnect() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown);
    this.domElement.removeEventListener("pointermove", this._onPointerMove);
    this.domElement.removeEventListener("pointerup", this._onPointerUp);
    this.domElement.removeEventListener("pointercancel", this._onPointerUp);
    this.domElement.removeEventListener("wheel", this._onMouseWheel);
    this.domElement.removeEventListener("contextmenu", this._onContextMenu);
    this.stopListenToKeyEvents();
    const document = this.domElement.getRootNode();
    document.removeEventListener("keydown", this._interceptControlDown, { capture: true });
    this.domElement.style.touchAction = "auto";
  }
  dispose() {
    this.disconnect();
  }
  getPolarAngle() {
    return this._spherical.phi;
  }
  getAzimuthalAngle() {
    return this._spherical.theta;
  }
  getDistance() {
    return this.object.position.distanceTo(this.target);
  }
  listenToKeyEvents(domElement) {
    domElement.addEventListener("keydown", this._onKeyDown);
    this._domElementKeyEvents = domElement;
  }
  stopListenToKeyEvents() {
    if (this._domElementKeyEvents !== null) {
      this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown);
      this._domElementKeyEvents = null;
    }
  }
  saveState() {
    this.target0.copy(this.target);
    this.position0.copy(this.object.position);
    this.zoom0 = this.object.zoom;
  }
  reset() {
    this.target.copy(this.target0);
    this.object.position.copy(this.position0);
    this.object.zoom = this.zoom0;
    this.object.updateProjectionMatrix();
    this.dispatchEvent(_changeEvent);
    this.update();
    this.state = _STATE.NONE;
  }
  update(deltaTime = null) {
    const position = this.object.position;
    _v.copy(position).sub(this.target);
    _v.applyQuaternion(this._quat);
    this._spherical.setFromVector3(_v);
    if (this.autoRotate && this.state === _STATE.NONE) {
      this._rotateLeft(this._getAutoRotationAngle(deltaTime));
    }
    if (this.enableDamping) {
      this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor;
      this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor;
    } else {
      this._spherical.theta += this._sphericalDelta.theta;
      this._spherical.phi += this._sphericalDelta.phi;
    }
    let min = this.minAzimuthAngle;
    let max = this.maxAzimuthAngle;
    if (isFinite(min) && isFinite(max)) {
      if (min < -Math.PI) min += _twoPI;
      else if (min > Math.PI) min -= _twoPI;
      if (max < -Math.PI) max += _twoPI;
      else if (max > Math.PI) max -= _twoPI;
      if (min <= max) {
        this._spherical.theta = Math.max(min, Math.min(max, this._spherical.theta));
      } else {
        this._spherical.theta = this._spherical.theta > (min + max) / 2 ? Math.max(min, this._spherical.theta) : Math.min(max, this._spherical.theta);
      }
    }
    this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi));
    this._spherical.makeSafe();
    if (this.enableDamping === true) {
      this.target.addScaledVector(this._panOffset, this.dampingFactor);
    } else {
      this.target.add(this._panOffset);
    }
    this.target.sub(this.cursor);
    this.target.clampLength(this.minTargetRadius, this.maxTargetRadius);
    this.target.add(this.cursor);
    let zoomChanged = false;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera) {
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    } else {
      const prevRadius = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale);
      zoomChanged = prevRadius != this._spherical.radius;
    }
    _v.setFromSpherical(this._spherical);
    _v.applyQuaternion(this._quatInverse);
    position.copy(this.target).add(_v);
    this.object.lookAt(this.target);
    if (this.enableDamping === true) {
      this._sphericalDelta.theta *= 1 - this.dampingFactor;
      this._sphericalDelta.phi *= 1 - this.dampingFactor;
      this._panOffset.multiplyScalar(1 - this.dampingFactor);
    } else {
      this._sphericalDelta.set(0, 0, 0);
      this._panOffset.set(0, 0, 0);
    }
    if (this.zoomToCursor && this._performCursorZoom) {
      let newRadius = null;
      if (this.object.isPerspectiveCamera) {
        const prevRadius = _v.length();
        newRadius = this._clampDistance(prevRadius * this._scale);
        const radiusDelta = prevRadius - newRadius;
        this.object.position.addScaledVector(this._dollyDirection, radiusDelta);
        this.object.updateMatrixWorld();
        zoomChanged = !!radiusDelta;
      } else if (this.object.isOrthographicCamera) {
        const mouseBefore = new Vector3(this._mouse.x, this._mouse.y, 0);
        mouseBefore.unproject(this.object);
        const prevZoom = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale));
        this.object.updateProjectionMatrix();
        zoomChanged = prevZoom !== this.object.zoom;
        const mouseAfter = new Vector3(this._mouse.x, this._mouse.y, 0);
        mouseAfter.unproject(this.object);
        this.object.position.sub(mouseAfter).add(mouseBefore);
        this.object.updateMatrixWorld();
        newRadius = _v.length();
      } else {
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.");
        this.zoomToCursor = false;
      }
      if (newRadius !== null) {
        if (this.screenSpacePanning) {
          this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(newRadius).add(this.object.position);
        } else {
          _ray.origin.copy(this.object.position);
          _ray.direction.set(0, 0, -1).transformDirection(this.object.matrix);
          if (Math.abs(this.object.up.dot(_ray.direction)) < _TILT_LIMIT) {
            this.object.lookAt(this.target);
          } else {
            _plane.setFromNormalAndCoplanarPoint(this.object.up, this.target);
            _ray.intersectPlane(_plane, this.target);
          }
        }
      }
    } else if (this.object.isOrthographicCamera) {
      const prevZoom = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale));
      if (prevZoom !== this.object.zoom) {
        this.object.updateProjectionMatrix();
        zoomChanged = true;
      }
    }
    this._scale = 1;
    this._performCursorZoom = false;
    if (zoomChanged || this._lastPosition.distanceToSquared(this.object.position) > _EPS || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > _EPS || this._lastTargetPosition.distanceToSquared(this.target) > _EPS) {
      this.dispatchEvent(_changeEvent);
      this._lastPosition.copy(this.object.position);
      this._lastQuaternion.copy(this.object.quaternion);
      this._lastTargetPosition.copy(this.target);
      return true;
    }
    return false;
  }
  _getAutoRotationAngle(deltaTime) {
    if (deltaTime !== null) {
      return _twoPI / 60 * this.autoRotateSpeed * deltaTime;
    } else {
      return _twoPI / 60 / 60 * this.autoRotateSpeed;
    }
  }
  _getZoomScale(delta) {
    const normalizedDelta = Math.abs(delta * 0.01);
    return Math.pow(0.95, this.zoomSpeed * normalizedDelta);
  }
  _rotateLeft(angle) {
    this._sphericalDelta.theta -= angle;
  }
  _rotateUp(angle) {
    this._sphericalDelta.phi -= angle;
  }
  _panLeft(distance, objectMatrix) {
    _v.setFromMatrixColumn(objectMatrix, 0);
    _v.multiplyScalar(-distance);
    this._panOffset.add(_v);
  }
  _panUp(distance, objectMatrix) {
    if (this.screenSpacePanning === true) {
      _v.setFromMatrixColumn(objectMatrix, 1);
    } else {
      _v.setFromMatrixColumn(objectMatrix, 0);
      _v.crossVectors(this.object.up, _v);
    }
    _v.multiplyScalar(distance);
    this._panOffset.add(_v);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(deltaX, deltaY) {
    const element = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const position = this.object.position;
      _v.copy(position).sub(this.target);
      let targetDistance = _v.length();
      targetDistance *= Math.tan(this.object.fov / 2 * Math.PI / 180);
      this._panLeft(2 * deltaX * targetDistance / element.clientHeight, this.object.matrix);
      this._panUp(2 * deltaY * targetDistance / element.clientHeight, this.object.matrix);
    } else if (this.object.isOrthographicCamera) {
      this._panLeft(deltaX * (this.object.right - this.object.left) / this.object.zoom / element.clientWidth, this.object.matrix);
      this._panUp(deltaY * (this.object.top - this.object.bottom) / this.object.zoom / element.clientHeight, this.object.matrix);
    } else {
      console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.");
      this.enablePan = false;
    }
  }
  _dollyOut(dollyScale) {
    if (this.object.isPerspectiveCamera || this.object.isOrthographicCamera) {
      this._scale /= dollyScale;
    } else {
      console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
      this.enableZoom = false;
    }
  }
  _dollyIn(dollyScale) {
    if (this.object.isPerspectiveCamera || this.object.isOrthographicCamera) {
      this._scale *= dollyScale;
    } else {
      console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
      this.enableZoom = false;
    }
  }
  _updateZoomParameters(x, y) {
    if (!this.zoomToCursor) {
      return;
    }
    this._performCursorZoom = true;
    const rect = this.domElement.getBoundingClientRect();
    const dx = x - rect.left;
    const dy = y - rect.top;
    const w = rect.width;
    const h = rect.height;
    this._mouse.x = dx / w * 2 - 1;
    this._mouse.y = -(dy / h) * 2 + 1;
    this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(dist) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, dist));
  }
  //
  // event callbacks - update the object state
  //
  _handleMouseDownRotate(event) {
    this._rotateStart.set(event.clientX, event.clientY);
  }
  _handleMouseDownDolly(event) {
    this._updateZoomParameters(event.clientX, event.clientX);
    this._dollyStart.set(event.clientX, event.clientY);
  }
  _handleMouseDownPan(event) {
    this._panStart.set(event.clientX, event.clientY);
  }
  _handleMouseMoveRotate(event) {
    this._rotateEnd.set(event.clientX, event.clientY);
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const element = this.domElement;
    this._rotateLeft(_twoPI * this._rotateDelta.x / element.clientHeight);
    this._rotateUp(_twoPI * this._rotateDelta.y / element.clientHeight);
    this._rotateStart.copy(this._rotateEnd);
    this.update();
  }
  _handleMouseMoveDolly(event) {
    this._dollyEnd.set(event.clientX, event.clientY);
    this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart);
    if (this._dollyDelta.y > 0) {
      this._dollyOut(this._getZoomScale(this._dollyDelta.y));
    } else if (this._dollyDelta.y < 0) {
      this._dollyIn(this._getZoomScale(this._dollyDelta.y));
    }
    this._dollyStart.copy(this._dollyEnd);
    this.update();
  }
  _handleMouseMovePan(event) {
    this._panEnd.set(event.clientX, event.clientY);
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed);
    this._pan(this._panDelta.x, this._panDelta.y);
    this._panStart.copy(this._panEnd);
    this.update();
  }
  _handleMouseWheel(event) {
    this._updateZoomParameters(event.clientX, event.clientY);
    if (event.deltaY < 0) {
      this._dollyIn(this._getZoomScale(event.deltaY));
    } else if (event.deltaY > 0) {
      this._dollyOut(this._getZoomScale(event.deltaY));
    }
    this.update();
  }
  _handleKeyDown(event) {
    let needsUpdate = false;
    switch (event.code) {
      case this.keys.UP:
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
          this._rotateUp(_twoPI * this.rotateSpeed / this.domElement.clientHeight);
        } else {
          this._pan(0, this.keyPanSpeed);
        }
        needsUpdate = true;
        break;
      case this.keys.BOTTOM:
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
          this._rotateUp(-_twoPI * this.rotateSpeed / this.domElement.clientHeight);
        } else {
          this._pan(0, -this.keyPanSpeed);
        }
        needsUpdate = true;
        break;
      case this.keys.LEFT:
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
          this._rotateLeft(_twoPI * this.rotateSpeed / this.domElement.clientHeight);
        } else {
          this._pan(this.keyPanSpeed, 0);
        }
        needsUpdate = true;
        break;
      case this.keys.RIGHT:
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
          this._rotateLeft(-_twoPI * this.rotateSpeed / this.domElement.clientHeight);
        } else {
          this._pan(-this.keyPanSpeed, 0);
        }
        needsUpdate = true;
        break;
    }
    if (needsUpdate) {
      event.preventDefault();
      this.update();
    }
  }
  _handleTouchStartRotate(event) {
    if (this._pointers.length === 1) {
      this._rotateStart.set(event.pageX, event.pageY);
    } else {
      const position = this._getSecondPointerPosition(event);
      const x = 0.5 * (event.pageX + position.x);
      const y = 0.5 * (event.pageY + position.y);
      this._rotateStart.set(x, y);
    }
  }
  _handleTouchStartPan(event) {
    if (this._pointers.length === 1) {
      this._panStart.set(event.pageX, event.pageY);
    } else {
      const position = this._getSecondPointerPosition(event);
      const x = 0.5 * (event.pageX + position.x);
      const y = 0.5 * (event.pageY + position.y);
      this._panStart.set(x, y);
    }
  }
  _handleTouchStartDolly(event) {
    const position = this._getSecondPointerPosition(event);
    const dx = event.pageX - position.x;
    const dy = event.pageY - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this._dollyStart.set(0, distance);
  }
  _handleTouchStartDollyPan(event) {
    if (this.enableZoom) this._handleTouchStartDolly(event);
    if (this.enablePan) this._handleTouchStartPan(event);
  }
  _handleTouchStartDollyRotate(event) {
    if (this.enableZoom) this._handleTouchStartDolly(event);
    if (this.enableRotate) this._handleTouchStartRotate(event);
  }
  _handleTouchMoveRotate(event) {
    if (this._pointers.length == 1) {
      this._rotateEnd.set(event.pageX, event.pageY);
    } else {
      const position = this._getSecondPointerPosition(event);
      const x = 0.5 * (event.pageX + position.x);
      const y = 0.5 * (event.pageY + position.y);
      this._rotateEnd.set(x, y);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const element = this.domElement;
    this._rotateLeft(_twoPI * this._rotateDelta.x / element.clientHeight);
    this._rotateUp(_twoPI * this._rotateDelta.y / element.clientHeight);
    this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(event) {
    if (this._pointers.length === 1) {
      this._panEnd.set(event.pageX, event.pageY);
    } else {
      const position = this._getSecondPointerPosition(event);
      const x = 0.5 * (event.pageX + position.x);
      const y = 0.5 * (event.pageY + position.y);
      this._panEnd.set(x, y);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed);
    this._pan(this._panDelta.x, this._panDelta.y);
    this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(event) {
    const position = this._getSecondPointerPosition(event);
    const dx = event.pageX - position.x;
    const dy = event.pageY - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this._dollyEnd.set(0, distance);
    this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed));
    this._dollyOut(this._dollyDelta.y);
    this._dollyStart.copy(this._dollyEnd);
    const centerX = (event.pageX + position.x) * 0.5;
    const centerY = (event.pageY + position.y) * 0.5;
    this._updateZoomParameters(centerX, centerY);
  }
  _handleTouchMoveDollyPan(event) {
    if (this.enableZoom) this._handleTouchMoveDolly(event);
    if (this.enablePan) this._handleTouchMovePan(event);
  }
  _handleTouchMoveDollyRotate(event) {
    if (this.enableZoom) this._handleTouchMoveDolly(event);
    if (this.enableRotate) this._handleTouchMoveRotate(event);
  }
  // pointers
  _addPointer(event) {
    this._pointers.push(event.pointerId);
  }
  _removePointer(event) {
    delete this._pointerPositions[event.pointerId];
    for (let i = 0; i < this._pointers.length; i++) {
      if (this._pointers[i] == event.pointerId) {
        this._pointers.splice(i, 1);
        return;
      }
    }
  }
  _isTrackingPointer(event) {
    for (let i = 0; i < this._pointers.length; i++) {
      if (this._pointers[i] == event.pointerId) return true;
    }
    return false;
  }
  _trackPointer(event) {
    let position = this._pointerPositions[event.pointerId];
    if (position === void 0) {
      position = new Vector2();
      this._pointerPositions[event.pointerId] = position;
    }
    position.set(event.pageX, event.pageY);
  }
  _getSecondPointerPosition(event) {
    const pointerId = event.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[pointerId];
  }
  //
  _customWheelEvent(event) {
    const mode = event.deltaMode;
    const newEvent = {
      clientX: event.clientX,
      clientY: event.clientY,
      deltaY: event.deltaY
    };
    switch (mode) {
      case 1:
        newEvent.deltaY *= 16;
        break;
      case 2:
        newEvent.deltaY *= 100;
        break;
    }
    if (event.ctrlKey && !this._controlActive) {
      newEvent.deltaY *= 10;
    }
    return newEvent;
  }
};
function onPointerDown(event) {
  if (this.enabled === false) return;
  if (this._pointers.length === 0) {
    this.domElement.setPointerCapture(event.pointerId);
    this.domElement.addEventListener("pointermove", this._onPointerMove);
    this.domElement.addEventListener("pointerup", this._onPointerUp);
  }
  if (this._isTrackingPointer(event)) return;
  this._addPointer(event);
  if (event.pointerType === "touch") {
    this._onTouchStart(event);
  } else {
    this._onMouseDown(event);
  }
}
function onPointerMove(event) {
  if (this.enabled === false) return;
  if (event.pointerType === "touch") {
    this._onTouchMove(event);
  } else {
    this._onMouseMove(event);
  }
}
function onPointerUp(event) {
  this._removePointer(event);
  switch (this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(event.pointerId);
      this.domElement.removeEventListener("pointermove", this._onPointerMove);
      this.domElement.removeEventListener("pointerup", this._onPointerUp);
      this.dispatchEvent(_endEvent);
      this.state = _STATE.NONE;
      break;
    case 1:
      const pointerId = this._pointers[0];
      const position = this._pointerPositions[pointerId];
      this._onTouchStart({ pointerId, pageX: position.x, pageY: position.y });
      break;
  }
}
function onMouseDown(event) {
  let mouseAction;
  switch (event.button) {
    case 0:
      mouseAction = this.mouseButtons.LEFT;
      break;
    case 1:
      mouseAction = this.mouseButtons.MIDDLE;
      break;
    case 2:
      mouseAction = this.mouseButtons.RIGHT;
      break;
    default:
      mouseAction = -1;
  }
  switch (mouseAction) {
    case MOUSE.DOLLY:
      if (this.enableZoom === false) return;
      this._handleMouseDownDolly(event);
      this.state = _STATE.DOLLY;
      break;
    case MOUSE.ROTATE:
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        if (this.enablePan === false) return;
        this._handleMouseDownPan(event);
        this.state = _STATE.PAN;
      } else {
        if (this.enableRotate === false) return;
        this._handleMouseDownRotate(event);
        this.state = _STATE.ROTATE;
      }
      break;
    case MOUSE.PAN:
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        if (this.enableRotate === false) return;
        this._handleMouseDownRotate(event);
        this.state = _STATE.ROTATE;
      } else {
        if (this.enablePan === false) return;
        this._handleMouseDownPan(event);
        this.state = _STATE.PAN;
      }
      break;
    default:
      this.state = _STATE.NONE;
  }
  if (this.state !== _STATE.NONE) {
    this.dispatchEvent(_startEvent);
  }
}
function onMouseMove(event) {
  switch (this.state) {
    case _STATE.ROTATE:
      if (this.enableRotate === false) return;
      this._handleMouseMoveRotate(event);
      break;
    case _STATE.DOLLY:
      if (this.enableZoom === false) return;
      this._handleMouseMoveDolly(event);
      break;
    case _STATE.PAN:
      if (this.enablePan === false) return;
      this._handleMouseMovePan(event);
      break;
  }
}
function onMouseWheel(event) {
  if (this.enabled === false || this.enableZoom === false || this.state !== _STATE.NONE) return;
  event.preventDefault();
  this.dispatchEvent(_startEvent);
  this._handleMouseWheel(this._customWheelEvent(event));
  this.dispatchEvent(_endEvent);
}
function onKeyDown(event) {
  if (this.enabled === false || this.enablePan === false) return;
  this._handleKeyDown(event);
}
function onTouchStart(event) {
  this._trackPointer(event);
  switch (this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case TOUCH.ROTATE:
          if (this.enableRotate === false) return;
          this._handleTouchStartRotate(event);
          this.state = _STATE.TOUCH_ROTATE;
          break;
        case TOUCH.PAN:
          if (this.enablePan === false) return;
          this._handleTouchStartPan(event);
          this.state = _STATE.TOUCH_PAN;
          break;
        default:
          this.state = _STATE.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case TOUCH.DOLLY_PAN:
          if (this.enableZoom === false && this.enablePan === false) return;
          this._handleTouchStartDollyPan(event);
          this.state = _STATE.TOUCH_DOLLY_PAN;
          break;
        case TOUCH.DOLLY_ROTATE:
          if (this.enableZoom === false && this.enableRotate === false) return;
          this._handleTouchStartDollyRotate(event);
          this.state = _STATE.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = _STATE.NONE;
      }
      break;
    default:
      this.state = _STATE.NONE;
  }
  if (this.state !== _STATE.NONE) {
    this.dispatchEvent(_startEvent);
  }
}
function onTouchMove(event) {
  this._trackPointer(event);
  switch (this.state) {
    case _STATE.TOUCH_ROTATE:
      if (this.enableRotate === false) return;
      this._handleTouchMoveRotate(event);
      this.update();
      break;
    case _STATE.TOUCH_PAN:
      if (this.enablePan === false) return;
      this._handleTouchMovePan(event);
      this.update();
      break;
    case _STATE.TOUCH_DOLLY_PAN:
      if (this.enableZoom === false && this.enablePan === false) return;
      this._handleTouchMoveDollyPan(event);
      this.update();
      break;
    case _STATE.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === false && this.enableRotate === false) return;
      this._handleTouchMoveDollyRotate(event);
      this.update();
      break;
    default:
      this.state = _STATE.NONE;
  }
}
function onContextMenu(event) {
  if (this.enabled === false) return;
  event.preventDefault();
}
function interceptControlDown(event) {
  if (event.key === "Control") {
    this._controlActive = true;
    const document = this.domElement.getRootNode();
    document.addEventListener("keyup", this._interceptControlUp, { passive: true, capture: true });
  }
}
function interceptControlUp(event) {
  if (event.key === "Control") {
    this._controlActive = false;
    const document = this.domElement.getRootNode();
    document.removeEventListener("keyup", this._interceptControlUp, { passive: true, capture: true });
  }
}
export {
  OrbitControls
};
//# sourceMappingURL=three_examples_jsm_controls_OrbitControls.js.map

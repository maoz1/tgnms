//
// Autogenerated by Thrift Compiler (0.11.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//


const thrift = require('thrift');
const Thrift = thrift.Thrift;
const Q = thrift.Q;

const Topology_ttypes = require('./Topology_types');


const ttypes = module.exports = {};
const NetworkConfig = module.exports.NetworkConfig = function(args) {
  this.topology_file = null;
  this.latitude = null;
  this.longitude = null;
  this.zoom_level = null;
  this.controller_ip = null;
  if (args) {
    if (args.topology_file !== undefined && args.topology_file !== null) {
      this.topology_file = args.topology_file;
    }
    if (args.latitude !== undefined && args.latitude !== null) {
      this.latitude = args.latitude;
    }
    if (args.longitude !== undefined && args.longitude !== null) {
      this.longitude = args.longitude;
    }
    if (args.zoom_level !== undefined && args.zoom_level !== null) {
      this.zoom_level = args.zoom_level;
    }
    if (args.controller_ip !== undefined && args.controller_ip !== null) {
      this.controller_ip = args.controller_ip;
    }
  }
};
NetworkConfig.prototype = {};
NetworkConfig.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.topology_file = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 10:
      if (ftype == Thrift.Type.DOUBLE) {
        this.latitude = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      case 11:
      if (ftype == Thrift.Type.DOUBLE) {
        this.longitude = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      case 12:
      if (ftype == Thrift.Type.I64) {
        this.zoom_level = input.readI64();
      } else {
        input.skip(ftype);
      }
      break;
      case 100:
      if (ftype == Thrift.Type.STRING) {
        this.controller_ip = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

NetworkConfig.prototype.write = function(output) {
  output.writeStructBegin('NetworkConfig');
  if (this.topology_file !== null && this.topology_file !== undefined) {
    output.writeFieldBegin('topology_file', Thrift.Type.STRING, 1);
    output.writeString(this.topology_file);
    output.writeFieldEnd();
  }
  if (this.latitude !== null && this.latitude !== undefined) {
    output.writeFieldBegin('latitude', Thrift.Type.DOUBLE, 10);
    output.writeDouble(this.latitude);
    output.writeFieldEnd();
  }
  if (this.longitude !== null && this.longitude !== undefined) {
    output.writeFieldBegin('longitude', Thrift.Type.DOUBLE, 11);
    output.writeDouble(this.longitude);
    output.writeFieldEnd();
  }
  if (this.zoom_level !== null && this.zoom_level !== undefined) {
    output.writeFieldBegin('zoom_level', Thrift.Type.I64, 12);
    output.writeI64(this.zoom_level);
    output.writeFieldEnd();
  }
  if (this.controller_ip !== null && this.controller_ip !== undefined) {
    output.writeFieldBegin('controller_ip', Thrift.Type.STRING, 100);
    output.writeString(this.controller_ip);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const NetworkConfigs = module.exports.NetworkConfigs = function(args) {
  this.topologies = null;
  if (args) {
    if (args.topologies !== undefined && args.topologies !== null) {
      this.topologies = Thrift.copyList(args.topologies, [ttypes.NetworkConfig]);
    }
  }
};
NetworkConfigs.prototype = {};
NetworkConfigs.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.LIST) {
        let _size0 = 0;
        var _rtmp34;
        this.topologies = [];
        let _etype3 = 0;
        _rtmp34 = input.readListBegin();
        _etype3 = _rtmp34.etype;
        _size0 = _rtmp34.size;
        for (let _i5 = 0; _i5 < _size0; ++_i5) {
          let elem6 = null;
          elem6 = new ttypes.NetworkConfig();
          elem6.read(input);
          this.topologies.push(elem6);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

NetworkConfigs.prototype.write = function(output) {
  output.writeStructBegin('NetworkConfigs');
  if (this.topologies !== null && this.topologies !== undefined) {
    output.writeFieldBegin('topologies', Thrift.Type.LIST, 1);
    output.writeListBegin(Thrift.Type.STRUCT, this.topologies.length);
    for (let iter7 in this.topologies) {
      if (this.topologies.hasOwnProperty(iter7)) {
        iter7 = this.topologies[iter7];
        iter7.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};


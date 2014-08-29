'use strict';
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var rewire = require('rewire');
var grunt = require('grunt');
var _ = grunt.util._;

var RecessTask = rewire('../tasks/lib/RecessTask');

chai.should();
chai.use(sinonChai);

describe('RecessTask', function () {
	var mockRecess
	var createMockTask
	var mockTask;

	/**
	 * Helper method for creating a mock task.
	 *
	 * @param {Function} [done]
	 * @returns {*}
	 */
	createMockTask = function (done) {
		return {
			_taskOptions: {
				compile: true,
				banner: 'some test banner text'
			},
			files: [
				{
					src: grunt.file.expand('./test/fixtures/valid.css'),
					dest: 'test/valid.css',
					orig: {
						src: grunt.file.expand('./test/fixtures/valid.css'),
						dest: 'test/valid.css'
					}
				}
			],
			options: function (defs) {
				return _.defaults(this._taskOptions, defs);
			},
			async: function () {
				return done;
			}
		};
	};

	beforeEach(function () {
		// Mock the 'recess' library (we want to test the grunt-recess task, not external code!)
		mockRecess = sinon.stub();
		RecessTask.__set__('recess', mockRecess);

		// Create a mock task
		mockTask = createMockTask();
	});

	afterEach(function () {
		mockTask = null;
	});

	it('should register itself with Grunt', function () {
		RecessTask.registerWithGrunt.should.exist;

		RecessTask.registerWithGrunt(grunt);
		grunt.task._tasks[RecessTask.TASK_NAME].should.exist;
	});

	it('should merge options from a task with the defaults', function () {
		var task;

		task = new RecessTask(mockTask);

		task.should.have.property('options');

		task.options.compile.should.equal(true);
		task.options.compress.should.equal(RecessTask.DEFAULT_OPTIONS.compress);
		task.options.banner.should.equal('some test banner text');
	});

	it('should call the RECESS library to lint the files', function () {
		var task;

		task = new RecessTask(mockTask);
		task.run();

		mockRecess.should.have.been.called;
	});

	it('should call the RECESS library with the correct parameters', function () {
		var task, expectedSrc, expectedOptions;

		expectedSrc = mockTask.files[0].src;
		expectedOptions = mockTask._taskOptions;

		task = new RecessTask(mockTask);
		task.run();

		mockRecess.should.have.been.calledWith(expectedSrc, expectedOptions);
	});
});

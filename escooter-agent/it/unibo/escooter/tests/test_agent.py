import sys

from it.unibo.escooter.agent import Scooter

import unittest

class ScooterTest(unittest.TestCase):
    def setUp(self):
        self.scooter = Scooter()

    def test_scooter_starts_from_origin(self):
        value = self.scooter.position
        self.assertEqual(
            value,
            [0.0, 0.0],
            f"The scooter does not start from the origin: {value}"
        )

if __name__ == '__main__':
    import xmlrunner

    unittest.main(
        testRunner=xmlrunner.XMLTestRunner(output='test-reports'),
        failfast=False,
        buffer=False,
        catchbreak=False,
    )
